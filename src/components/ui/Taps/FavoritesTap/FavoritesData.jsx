"use client";

import { useState, useTransition } from "react";
import ProductsCardAsColomns from "@/components/shared/Products/ProductsCardAsColomns";
import ProductModal from "@/components/shared/Model/ProductModal";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import SlugMethods from "@/actions/SlugMethods";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import { useDashboard } from "@/Context/DashboardContext";
import ProductsCardAsColomnsSkeleton from "@/components/shared/Skelatons/ProductsCardAsColomnsSkeleton";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

const FavoritesData = ({ data = [], locale, NotYet, pagination }) => {
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isPending, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 1);
  const [favoritesList, setFavoritesList] = useState(data);

  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({ message: null, type: "" });
  const { openSidebar } = useDashboard();

  const breakpoints = {
    0: { slidesPerView: 1 },
    700: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
  };

  const toggleFavorite = async (productId) => {
    if (!productId || loadingProductId === productId) return;

    setLoadingProductId(productId);

    try {
      await SlugMethods(
        `favorites?where[product][equals]=${productId}`,
        "DELETE",
      );

      setFavoritesList((prev) =>
        prev.filter((item) => {
          const pId =
            item?.product?.id || item?.product?._id || item?.id || item?._id;
          return pId !== productId;
        }),
      );

      setToast({
        message:
          locale === "ar"
            ? "تمت إزالة المنتج من المفضلة"
            : "Product removed from favorites",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete favorite:", error);

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

  const products = favoritesList.map((favorite) => {
    const rawProduct = favorite?.product || favorite;
    return {
      ...rawProduct,
      isFavorite: true,
    };
  });

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isPending) return;

    setIsLoadingPage(true);

    startTransition(async () => {
      try {
        const result = await GetDataWithPagination(
          "favorites",
          newPage,
          9,
          "",
          {},
          true,
        );

        if (result?.docs) {
          setFavoritesList(result.docs);
          setCurrentPage(result.page);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch pagination page:", error);
        setToast({
          message: locale === "ar" ? "فشل تحميل الصفحة" : "Failed to load page",
          type: "error",
        });
      } finally {
        setIsLoadingPage(false);
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center mb-4 h-full">
        {favoritesList.length === 0 && !isLoadingPage ? (
          <p className="text-center my-10 font-semibold text-lg text-base-lighter">
            {NotYet}
          </p>
        ) : isLoadingPage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 9 }).map((_, index) => (
              <ProductsCardAsColomnsSkeleton key={index} isCustom={true} />
            ))}
          </div>
        ) : (
          <GridSwiper
            filteredProducts={products}
            loop={false}
            enablePagePagination={true}
            breakpoints={breakpoints}
            sideBarIsOpen={openSidebar}
            makeBulletsWhilePagePagination={true}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            PaddingBottom="20px"
            renderItem={(product) => {
              const productId = product?.id || product?._id;
              const isLoading = loadingProductId === productId;

              return (
                <ProductsCardAsColomns
                  product={product}
                  locale={locale}
                  setOpenModel={setOpenModel}
                  setSelectedProduct={setSelectedProduct}
                  isCustom={true}
                  customBgColor="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-base-border shadow-sm hover:shadow-md transition-all rounded-xl"
                  isFavorite={product.isFavorite}
                  toggleFavorite={() => toggleFavorite(productId)}
                  isLoading={isLoading}
                />
              );
            }}
          />
        )}
      </div>

      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />

      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
    </>
  );
};

export default FavoritesData;
