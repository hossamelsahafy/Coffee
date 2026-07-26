"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProductSlug from "@/components/ui/ProductsPage/Slug/ProductSlug";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dnszjyuxi/video/upload/v1777996181/d07af386638640c5be2b435380d446de_zsllkn.mp4";

const ProductSlugClient = ({
  dataBySlug,
  products = [],
  importantProducts = [],
  locale,
  userFavorites,
}) => {
  const { user } = useUser();

  const favoriteIds = useMemo(() => {
    const docs = Array.isArray(userFavorites?.docs)
      ? userFavorites.docs
      : Array.isArray(userFavorites)
        ? userFavorites
        : [];

    return new Set(
      docs
        .map((doc) => doc?.product?.id ?? doc?.product?._id ?? doc?.product)
        .filter((id) => typeof id === "string" || typeof id === "number"),
    );
  }, [userFavorites]);

  const [currentProduct, setCurrentProduct] = useState(() => ({
    ...dataBySlug,
    isFavorite: favoriteIds.has(dataBySlug?.id || dataBySlug?._id),
  }));

  const [importantList, setImportantList] = useState(() =>
    importantProducts.map((p) => ({
      ...p,
      isFavorite: favoriteIds.has(p?.id || p?._id),
    })),
  );

  const [productsList, setProductsList] = useState(() =>
    products.map((p) => ({
      ...p,
      isFavorite: favoriteIds.has(p?.id || p?._id),
    })),
  );

  const [loadingProductId, setLoadingProductId] = useState(null);
  const [toast, setToast] = useState({ message: null, type: "" });

  useEffect(() => {
    if (dataBySlug) {
      setCurrentProduct({
        ...dataBySlug,
        isFavorite: favoriteIds.has(dataBySlug?.id || dataBySlug?._id),
      });
    }
    setImportantList(
      importantProducts.map((p) => ({
        ...p,
        isFavorite: favoriteIds.has(p?.id || p?._id),
      })),
    );
    setProductsList(
      products.map((p) => ({
        ...p,
        isFavorite: favoriteIds.has(p?.id || p?._id),
      })),
    );
  }, [dataBySlug, importantProducts, products, favoriteIds]);

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

    if (!productId || loadingProductId === productId) return;
    const nextState = !currentIsFavorite;

    const updateLocalState = (isFav) => {
      // Main product update
      setCurrentProduct((prev) => {
        const curId = prev?.id || prev?._id;
        if (curId === productId) {
          return { ...prev, isFavorite: isFav };
        }
        return prev;
      });

      // Important products list update
      setImportantList((prev) =>
        prev.map((p) =>
          p?.id === productId || p?._id === productId
            ? { ...p, isFavorite: isFav }
            : p,
        ),
      );

      // Related products list update
      setProductsList((prev) =>
        prev.map((p) =>
          p?.id === productId || p?._id === productId
            ? { ...p, isFavorite: isFav }
            : p,
        ),
      );
    };

    updateLocalState(nextState);
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
      updateLocalState(currentIsFavorite);
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

  return (
    <>
      <div className="border-t p-4 mt-20 border-base-border w-full">
        <ProductSlug
          data={currentProduct}
          locale={locale}
          products={productsList}
          onToggleFavorite={toggleFavorite}
          loadingProductId={loadingProductId}
        />
        <div className="h-full w-full">
          <HeaderTwo
            onToggleFavorite={toggleFavorite}
            loadingProductId={loadingProductId}
            importantProducts={importantList}
            src={HERO_VIDEO_URL}
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

export default ProductSlugClient;
