"use client";
import React, { useState } from "react";
import HighLightedProducts from "@/components/ui/home/Products/HightLightedProducts";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
import DiscountSection from "@/components/ui/home/DiscountProducts/DisCountSection";
import BestSellingSection from "@/components/ui/home/BestSells/BestSellingSection";
import ReviewsSection from "@/components/ui/home/Reviews/ReviewsSection";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

export default function HomePageClient({
  initialProducts,
  categories,
  locale,
  initialReviewsMap,
  SecondHeaderSection,
  ReviewsSectionData,
  discountSection,
  BestSellingSectionData,
  websiteName,
  countries,
  importantProducts,
  discountProducts,
  bestSellingProducts,
  productsPagesData,
}) {
  const { user } = useUser();
  const [productList, setProductList] = useState(initialProducts || []);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [favoriteState, setFavoriteState] = useState({});
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

    const previousState =
      favoriteState[productId] ?? currentIsFavorite ?? false;

    const nextState = !previousState;

    // Optimistic UI update
    setFavoriteState((prev) => ({
      ...prev,
      [productId]: nextState,
    }));

    setLoadingProductId(productId);

    try {
      if (nextState) {
        await SlugMethods("favorites", "POST", {
          product: productId,
        });

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

      // Rollback
      setFavoriteState((prev) => ({
        ...prev,
        [productId]: previousState,
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
  };

  const handleAddToCart = (isIn) => {
    setToast({
      message: isIn
        ? locale === "ar"
          ? "تمت إضافة المنتج إلى السلة"
          : "Product added to cart"
        : locale === "ar"
          ? "المنتج غير متوفر"
          : "Product is sold out",
      type: isIn ? "success" : "error",
    });
  };

  return (
    <>
      <HighLightedProducts
        categories={categories}
        products={productList}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
        productsPagesData={productsPagesData}
        onAddToCart={handleAddToCart}
        favoriteState={favoriteState}
      />
      <HeaderTwo
        importantProducts={importantProducts}
        secondHeader={SecondHeaderSection}
        locale={locale}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
        onAddToCart={handleAddToCart}
        favoriteState={favoriteState}
      />
      <ReviewsSection
        initialReviewsMap={initialReviewsMap}
        websiteName={websiteName}
        ReviewsSectionData={ReviewsSectionData}
        locale={locale}
        countries={countries.docs}
      />
      <DiscountSection
        data={discountProducts}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
        websiteName={websiteName}
        discountSection={discountSection}
        locale={locale}
        onAddToCart={handleAddToCart}
        favoriteState={favoriteState}
      />
      <BestSellingSection
        data={bestSellingProducts}
        locale={locale}
        onToggleFavorite={toggleFavorite}
        loadingProductId={loadingProductId}
        onAddToCart={handleAddToCart}
        bestSellingSectionData={BestSellingSectionData}
        websiteName={websiteName}
        favoriteState={favoriteState}
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
