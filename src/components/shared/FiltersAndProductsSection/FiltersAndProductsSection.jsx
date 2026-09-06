"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useTransition,
  useRef,
} from "react";
import { useTranslations } from "next-intl";
import RightSideProducts from "./RightSideProducts";

import { useUser } from "@/Context/userContext";
import Aside from "./Aside";
import SlugMethods from "@/actions/SlugMethods";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

const FiltersAndProductsSection = ({
  CurrentLocation,
  locale,
  products = [],
  userFavorites = [],
  paginationInfo = { totalPages: 1, page: 1 },
  currentSort = "-createdAt",
  brands,
  categories,
  productOptions,
}) => {
  const t = useTranslations("FiltersAndProductsSection");
  const { user } = useUser();

  const [isPending, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [productList, setProductList] = useState(products);
  const [currentPage, setCurrentPage] = useState(paginationInfo?.page || 1);
  const [totalPages, setTotalPages] = useState(paginationInfo?.totalPages || 1);
  const loadingTimerRef = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [filterLimits, setFilterLimits] = useState({
    category: 5,
    brand: 5,
    color: 5,
    quantity: 5,
    types: 5,
    size: 5,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    availability: [],
    minPrice: "",
    maxPrice: "",
    category: [],
    brand: [],
    color: [],
    quantity: [],
    types: [],
    size: [],
  });

  const loadMoreFilter = useCallback((filterId) => {
    setFilterLimits((prev) => ({
      ...prev,
      [filterId]: (prev[filterId] || 5) + 5,
    }));
  }, []);

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

  const formattedProductList = useMemo(() => {
    return productList.map((product) => {
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
  }, [productList, favoriteIds, favoriteOverrides]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({ message: null, type: "" });

  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [collapsedFilters, setCollapsedFilters] = useState({});
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const fetchFilteredProducts = useCallback(
    (pageToFetch = 1, filters = selectedFilters, sort = currentSort) => {
      setIsLoadingPage(true);
      setProductList([]);
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }

      loadingTimerRef.current = setTimeout(() => {
        setShowSkeleton(true);
      }, 200);
      startTransition(async () => {
        try {
          const where = {};

          if (filters.availability?.length === 1) {
            where["choices.options.availability"] = {
              equals:
                filters.availability[0] === "in_stock"
                  ? "inStock"
                  : "outOfStock",
            };
          }

          if (filters.minPrice !== "") {
            where["choices.options.priceAfter"] = {
              ...(where["choices.options.priceAfter"] || {}),
              greater_than_equal: Number(filters.minPrice),
            };
          }

          if (filters.maxPrice !== "") {
            where["choices.options.priceAfter"] = {
              ...(where["choices.options.priceAfter"] || {}),
              less_than_equal: Number(filters.maxPrice),
            };
          }

          if (filters.brand?.length > 0) {
            where.BrandName = { in: filters.brand };
          }

          if (filters.category?.length > 0) {
            where.category = { in: filters.category };
          }

          const optionTypes = ["color", "quantity", "types", "size"];

          const selectedOptionValues = optionTypes.flatMap(
            (type) => filters[type] || [],
          );

          if (selectedOptionValues.length > 0) {
            where["choices.options.value"] = {
              in: selectedOptionValues,
            };
          }

          const result = await GetDataWithPagination(
            "products",
            pageToFetch,
            12,
            sort,
            where,
            true,
          );

          if (result?.docs) {
            setProductList(result.docs);
            setCurrentPage(result.page);
            setTotalPages(result.totalPages);
          }
        } catch (error) {
          console.error("Failed to fetch filtered products:", error);

          setToast({
            message:
              locale === "ar" ? "فشل تحميل البيانات" : "Failed to load data",
            type: "error",
          });
        } finally {
          if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
          }
          setShowSkeleton(false);
          setIsLoadingPage(false);
        }
      });
    },
    [selectedFilters, currentSort, locale],
  );
  useEffect(() => {
    fetchFilteredProducts(1, selectedFilters, currentSort);
  }, [selectedFilters, currentSort, fetchFilteredProducts]);

  const handleSortChange = useCallback(
    (newSortValue) => {
      fetchFilteredProducts(1, selectedFilters, newSortValue);
    },
    [selectedFilters, fetchFilteredProducts],
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === currentPage || isPending) return;
      fetchFilteredProducts(newPage, selectedFilters, currentSort);
    },
    [
      currentPage,
      isPending,
      selectedFilters,
      currentSort,
      fetchFilteredProducts,
    ],
  );

  const toggleCollapse = useCallback((id) => {
    setCollapsedFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const resetFilter = useCallback((id) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: id === "Price" ? "" : [],
      ...(id === "Price" ? { minPrice: "", maxPrice: "" } : {}),
    }));
  }, []);

  const toggleOption = useCallback((key, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[key] || [];
      const exists = currentValues.includes(value);
      return {
        ...prev,
        [key]: exists
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  }, []);

  const handlePriceChange = useCallback((min, max) => {
    setSelectedFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  }, []);

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

  const Filters = useMemo(() => {
    const options = productOptions?.docs || [];

    const getOptionsByType = (type) => {
      const allMatching = options
        .filter((option) => option.type === type)
        .map((option) => ({
          value: option.id,
          label: {
            en: option.name,
            ar: option.nameAr,
          },
        }));

      const limit = filterLimits[type] || 5;
      return {
        sliced: allMatching.slice(0, limit),
        hasMore: limit < allMatching.length,
      };
    };

    const getMappedList = (list, type) => {
      const all =
        list?.docs?.map((item) => ({
          value: item.id,
          label: {
            en: item.title || item.name,
            ar: item.titleAr || item.nameAr,
          },
        })) || [];

      const limit = filterLimits[type] || 5;
      return {
        sliced: all.slice(0, limit),
        hasMore: limit < all.length,
      };
    };

    const categoriesData = getMappedList(categories, "category");
    const brandsData = getMappedList(brands, "brand");
    const colorData = getOptionsByType("color");
    const quantityData = getOptionsByType("quantity");
    const typesData = getOptionsByType("types");
    const sizeData = getOptionsByType("size");

    return [
      {
        id: "availability",
        title: { en: "Availability", ar: "التوفر" },
        options: [
          { value: "in_stock", label: { en: "In stock", ar: "متوفر" } },
          {
            value: "out_stock",
            label: { en: "Out of stock", ar: "غير متوفر" },
          },
        ],
      },
      {
        id: "Price",
        title: { en: "Price", ar: "السعر" },
      },
      {
        id: "category",
        title: { en: "Collection", ar: "المجموعة" },
        options: categoriesData.sliced,
        hasMore: categoriesData.hasMore,
      },
      {
        id: "brand",
        title: { en: "Brand", ar: "العلامة التجارية" },
        options: brandsData.sliced,
        hasMore: brandsData.hasMore,
      },
      {
        id: "color",
        title: { en: "Color", ar: "اللون" },
        options: colorData.sliced,
        hasMore: colorData.hasMore,
      },
      {
        id: "quantity",
        title: { en: "Quantity", ar: "الكمية" },
        options: quantityData.sliced,
        hasMore: quantityData.hasMore,
      },
      {
        id: "types",
        title: { en: "Type", ar: "النوع" },
        options: typesData.sliced,
        hasMore: typesData.hasMore,
      },
      {
        id: "size",
        title: { en: "Size", ar: "الحجم" },
        options: sizeData.sliced,
        hasMore: sizeData.hasMore,
      },
    ];
  }, [brands, categories, productOptions, filterLimits]);
  const showSkeletonState = showSkeleton || isPending;
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
              onPriceChange={handlePriceChange}
              onLoadMore={loadMoreFilter}
            />
          </div>

          <RightSideProducts
            t={t}
            sortedData={formattedProductList}
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={showSkeletonState}
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
