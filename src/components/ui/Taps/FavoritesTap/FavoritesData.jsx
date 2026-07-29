"use client";

import { useState } from "react";
import ProductsCardAsColomns from "@/components/shared/Products/ProductsCardAsColomns";
import ProductModal from "@/components/shared/Model/ProductModal";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import SlugMethods from "@/actions/SlugMethods";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import { useDashboard } from "@/Context/DashboardContext";

const FavoritesData = ({ data = [], locale, NotYet }) => {
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  if (!favoritesList || favoritesList.length === 0) {
    return (
      <p className="text-center my-10 font-semibold text-lg text-base-lighter">
        {NotYet}
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full justify-center mb-4 h-full">
        <GridSwiper
          filteredProducts={products}
          loop={false}
          enablePagePagination
          breakpoints={breakpoints}
          sideBarIsOpen={openSidebar}
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
