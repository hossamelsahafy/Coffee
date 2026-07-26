"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getSortedData,
  getStockCounts,
  HigherPrice,
  getPrice,
} from "@/lib/sortAndFilterProducts";
import RightSideProducts from "./RightSideProducts";
import useAttributeCounts from "@/hooks/useAttributeCounts";
import useFilterConfig from "@/lib/FilterConfig";
import { useUser } from "@/Context/userContext";
import Aside from "./Aside";
import SlugMethods from "@/actions/SlugMethods";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

const FiltersAndProductsSection = ({
  CurrentLocation,
  locale,
  data = [],
  userFavorites = [],
}) => {
  const t = useTranslations("FiltersAndProductsSection");
  const { user } = useUser();

  const favoriteIds = useMemo(() => {
    const docs = Array.isArray(userFavorites?.docs)
      ? userFavorites.docs
      : Array.isArray(userFavorites)
        ? userFavorites
        : [];

    return new Set(
      docs
        .map(
          (doc) =>
            doc?.product?.id ??
            doc?.product?._id ??
            doc?.product ??
            doc?.id ??
            doc,
        )
        .filter(Boolean),
    );
  }, [userFavorites]);

  const [productList, setProductList] = useState(() =>
    data.map((product) => ({
      ...product,
      isFavorite: favoriteIds.has(product.id || product._id),
    })),
  );

  useEffect(() => {
    setProductList(
      data.map((product) => ({
        ...product,
        isFavorite: favoriteIds.has(product.id || product._id),
      })),
    );
  }, [data, favoriteIds]);

  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({ message: null, type: "" });

  const [sortType, setSortType] = useState("best_selling");
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [collapsedFilters, setCollapsedFilters] = useState({});
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const sortedData = useMemo(
    () => getSortedData(productList, sortType, locale),
    [productList, sortType, locale],
  );

  const { inStock, outOfStock } = getStockCounts(sortedData);
  const currency = locale === "en" ? "USD" : "دولار";

  const toggleFavorite = async (productId, currentIsFavorite) => {
    if (!user) {
      setToast({
        message:
          locale === "ar"
            ? "يجب تسجيل الدخول لإضافة المنتجات إلى المفضلة"
            : "You need to login to add products to favorites",
        type: "error",
      });
      return;
    }

    if (loadingProductId === productId) return;
    const nextState = !currentIsFavorite;

    setProductList((prev) =>
      prev.map((p) =>
        p.id === productId || p._id === productId
          ? { ...p, isFavorite: nextState }
          : p,
      ),
    );
    setLoadingProductId(productId);

    try {
      if (nextState) {
        await SlugMethods("favorites", "POST", { product: productId });
        setToast({
          message:
            locale === "ar"
              ? "تمت إضافة المنتج إلى المفضلة"
              : "Product added to favorites",
          type: "success",
        });
      } else {
        await SlugMethods(
          `favorites?where[product][equals]=${productId}`,
          "DELETE",
        );
        setToast({
          message:
            locale === "ar"
              ? "تمت إزالة المنتج من المفضلة"
              : "Product removed from favorites",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      setProductList((prev) =>
        prev.map((p) =>
          p.id === productId || p._id === productId
            ? { ...p, isFavorite: currentIsFavorite }
            : p,
        ),
      );
      setToast({
        message:
          locale === "ar"
            ? "حدث خطأ أثناء التحديث"
            : "Failed to update favorites",
        type: "error",
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  const HigherP = HigherPrice(productList);
  const defaultFilters = {
    availability: [],
    minPrice: "",
    maxPrice: HigherP,
    category: [],
    type: [],
    colors: [],
    quantity: [],
    sizes: [],
  };

  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);

  const filterData = (items, filters) => {
    return items.filter((product) => {
      const options = product.choices?.options || [];
      const hasInStock = options.some((o) => o.availability === "inStock");
      const hasOutOfStock = options.some(
        (o) => o.availability === "outOfStock",
      );

      if (filters.availability.length > 0) {
        const ok =
          (filters.availability.includes("in_stock") && hasInStock) ||
          (filters.availability.includes("out_stock") && hasOutOfStock);

        if (!ok) return false;
      }

      const productPrice = getPrice(product);
      const min = Number(filters.minPrice) || 0;
      const max = Number(filters.maxPrice) || Infinity;

      if (productPrice < min || productPrice > max) {
        return false;
      }
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.category?.title)
      ) {
        return false;
      }
      if (filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false;
      }
      if (
        filters.colors.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.colors.includes(option.value),
        )
      ) {
        return false;
      }
      if (
        filters.sizes.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.sizes.includes(option.value),
        )
      ) {
        return false;
      }
      if (
        filters.quantity.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.quantity.includes(option.value),
        )
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredData = useMemo(
    () => filterData(sortedData, selectedFilters),
    [sortedData, selectedFilters],
  );

  const toggleCollapse = (id) => {
    setCollapsedFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetFilter = (id) => {
    if (id === "Price") {
      setSelectedFilters((prev) => ({
        ...prev,
        minPrice: "",
        maxPrice: HigherP,
      }));
      return;
    }

    setSelectedFilters((prev) => ({
      ...prev,
      [id]: defaultFilters[id],
    }));
  };

  const toggleOption = (key, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const dataType = useAttributeCounts(productList, filteredData, "type", true);
  const dataColors = useAttributeCounts(productList, filteredData, "color");
  const dataSizes = useAttributeCounts(productList, filteredData, "size");
  const dataQuantity = useAttributeCounts(
    productList,
    filteredData,
    "quantity",
  );
  const categories = useAttributeCounts(productList, filteredData, "category");

  const Filters = useFilterConfig({
    inStock,
    outOfStock,
    HigherP,
    currency,
    categories,
    dataType,
    dataColors,
    dataSizes,
    dataQuantity,
  });

  return (
    <>
      <div className="container-custom p-4 md:min-h-screen h-auto flex flex-col">
        <div className="flex gap-4 w-full md:min-h-screen h-auto text-base-dark">
          <div className="md:block hidden w-1/4 border-e border-base-borderTwo -my-4 -ml-4 overflow-hidden">
            <Aside
              FiltersLabel={t("Filters")}
              Filters={Filters}
              collapsedFilters={collapsedFilters}
              selectedFilters={selectedFilters}
              selectLabel={t("selected")}
              resetLabel={t("reset")}
              minLabel={t("min")}
              maxLabel={t("max")}
              setSelectedFilters={setSelectedFilters}
              toggleCollapse={toggleCollapse}
              toggleOption={toggleOption}
              locale={locale}
              resetFilter={resetFilter}
            />
          </div>

          <RightSideProducts
            t={t}
            sortedData={filteredData}
            setOpenModel={setOpenModel}
            locale={locale}
            CurrentLocation={CurrentLocation}
            setSelectedProduct={setSelectedProduct}
            sortType={sortType}
            setSortType={setSortType}
            openModel={openModel}
            selectedProduct={selectedProduct}
            selectedFilters={selectedFilters}
            openFilterModal={openFilterModal}
            setOpenFilterModal={setOpenFilterModal}
            FiltersLabel={t("Filters")}
            Filters={Filters}
            collapsedFilters={collapsedFilters}
            selectLabel={t("selected")}
            resetLabel={t("reset")}
            minLabel={t("min")}
            maxLabel={t("max")}
            setSelectedFilters={setSelectedFilters}
            toggleCollapse={toggleCollapse}
            toggleOption={toggleOption}
            resetFilter={resetFilter}
            toggleFavorite={toggleFavorite}
            loadingProductId={loadingProductId}
          />
        </div>
      </div>

      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
    </>
  );
};

export default FiltersAndProductsSection;
