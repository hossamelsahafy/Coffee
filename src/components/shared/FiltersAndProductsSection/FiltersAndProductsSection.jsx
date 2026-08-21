"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  products = [],
  userFavorites = [],
  paginationInfo = { totalPages: 1, page: 1 },
  currentSort = "-createdAt",
}) => {
  const t = useTranslations("FiltersAndProductsSection");
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const favoriteIds = useMemo(() => {
    const rawList = userFavorites?.docs || userFavorites || [];
    const docs = Array.isArray(rawList) ? rawList : [];

    return new Set(
      docs
        .map((doc) => {
          if (!doc) return null;
          if (typeof doc.product === "object" && doc.product !== null) {
            return doc.product.id || doc.product._id;
          }
          return doc.product || doc.id || doc._id || doc;
        })
        .filter(Boolean),
    );
  }, [userFavorites]);

  const [favoriteOverrides, setFavoriteOverrides] = useState({});

  const productList = useMemo(() => {
    return products.map((product) => {
      const id = product.id || product._id;
      const isFav =
        favoriteOverrides[id] !== undefined
          ? favoriteOverrides[id]
          : favoriteIds.has(id);

      return {
        ...product,
        isFavorite: isFav,
      };
    });
  }, [products, favoriteIds, favoriteOverrides]);

  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({ message: null, type: "" });

  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [collapsedFilters, setCollapsedFilters] = useState({});
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const updateQueryParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleSortChange = useCallback(
    (newSortValue) => {
      updateQueryParam("sort", newSortValue);
    },
    [updateQueryParam],
  );

  const handlePageChange = useCallback(
    (newPage) => {
      updateQueryParam("page", String(newPage));
    },
    [updateQueryParam],
  );

  const currency = locale === "en" ? "USD" : "دولار";

  const defaultFilters = useMemo(
    () => ({
      availability: [],
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      category: [],
      type: [],
      colors: [],
      quantity: [],
      sizes: [],
    }),
    [searchParams],
  );

  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);

  const toggleCollapse = useCallback((id) => {
    setCollapsedFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const resetFilter = useCallback(
    (id) => {
      if (id === "Price") {
        updateQueryParam("minPrice", null);
        updateQueryParam("maxPrice", null);
      }

      setSelectedFilters((prev) => ({
        ...prev,
        [id]: defaultFilters[id],
      }));
    },
    [defaultFilters, updateQueryParam],
  );

  const toggleOption = useCallback((key, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  }, []);

  const dataType = useAttributeCounts(productList, productList, "type", true);
  const dataColors = useAttributeCounts(productList, productList, "color");
  const dataSizes = useAttributeCounts(productList, productList, "size");
  const dataQuantity = useAttributeCounts(productList, productList, "quantity");
  const categories = useAttributeCounts(productList, productList, "category");

  const Filters = useFilterConfig({
    inStock: 0,
    outOfStock: 0,
    HigherP: 1000,
    currency,
    categories,
    dataType,
    dataColors,
    dataSizes,
    dataQuantity,
  });

  const toggleFavorite = useCallback(
    async (productId, currentIsFavorite) => {
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

      setFavoriteOverrides((prev) => ({ ...prev, [productId]: nextState }));
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
        setFavoriteOverrides((prev) => ({
          ...prev,
          [productId]: currentIsFavorite,
        }));
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
    },
    [user, locale, loadingProductId],
  );

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
            sortedData={productList}
            setOpenModel={setOpenModel}
            locale={locale}
            CurrentLocation={CurrentLocation}
            setSelectedProduct={setSelectedProduct}
            sortType={currentSort}
            setSortType={handleSortChange}
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
            currentPage={paginationInfo.page || 1}
            totalPages={paginationInfo.totalPages || 1}
            onPageChange={handlePageChange}
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
