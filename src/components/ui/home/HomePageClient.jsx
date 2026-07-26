"use client";
import React, { useState } from "react";
import HighLightedProducts from "@/components/ui/home/Products/HightLightedProducts";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
import DiscountSection from "@/components/ui/home/DiscountProducts/DisCountSection";
import BestSellingSection from "@/components/ui/home/BestSells/BestSellingSection";
import BlogsSection from "@/components/ui/home/Reviews/BlogsSection";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

export default function HomePageClient({
  initialProducts,
  categories,
  locale,
  blogs,
}) {
  const { user } = useUser();
  const [productList, setProductList] = useState(initialProducts || []);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({
    message: null,
    type: "",
  });

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
        p.id === productId ? { ...p, isFavorite: nextState } : p,
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
          p.id === productId ? { ...p, isFavorite: currentIsFavorite } : p,
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

  const importantProducts = productList.filter((p) => p.important);
  const discountProducts = productList.filter((p) => p.ShowInDiscountSection);
  const bestSellingProducts = productList.filter((p) => p.isBestSeller);

  return (
    <>
      <HighLightedProducts
        categories={categories}
        products={productList}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
      />
      <HeaderTwo
        importantProducts={importantProducts}
        src="https://res.cloudinary.com/dnszjyuxi/video/upload/v1773676563/Coffe2_igrxsq.mp4"
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
      />
      <BlogsSection Blogs={blogs} />

      <DiscountSection
        data={discountProducts}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
      />
      <BestSellingSection
        data={bestSellingProducts}
        locale={locale}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
      />

      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
    </>
  );
}
