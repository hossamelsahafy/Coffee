"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProductSlug from "@/components/ui/ProductsPage/Slug/ProductSlug";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

const getProductId = (product) => String(product?.id ?? product?._id ?? "");

const ProductSlugClient = ({
  dataBySlug,
  products = [],
  importantProducts = [],
  locale,
  userFavorites,
  HERO_VIDEO_URL,
  rightSideImage,
  pageData,
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
        .map((doc) =>
          String(doc?.product?.id ?? doc?.product?._id ?? doc?.product ?? ""),
        )
        .filter(Boolean),
    );
  }, [userFavorites]);

  const [favoriteState, setFavoriteState] = useState({});

  const [loadingProductId, setLoadingProductId] = useState(null);

  const [toast, setToast] = useState({
    message: null,
    type: "",
  });

  useEffect(() => {
    const state = {};

    if (dataBySlug) {
      const id = getProductId(dataBySlug);

      if (id) {
        state[id] = favoriteIds.has(id);
      }
    }

    products.forEach((product) => {
      const id = getProductId(product);

      if (id) {
        state[id] = favoriteIds.has(id);
      }
    });

    importantProducts.forEach((product) => {
      const id = getProductId(product);

      if (id) {
        state[id] = favoriteIds.has(id);
      }
    });

    setFavoriteState(state);
  }, [dataBySlug, products, importantProducts, favoriteIds]);

  const currentProduct = useMemo(() => {
    if (!dataBySlug) return null;

    const id = getProductId(dataBySlug);

    return {
      ...dataBySlug,
      isFavorite: favoriteState[id] ?? favoriteIds.has(id),
    };
  }, [dataBySlug, favoriteState, favoriteIds]);

  const importantList = useMemo(() => {
    return importantProducts.map((product) => {
      const id = getProductId(product);

      return {
        ...product,
        isFavorite: favoriteState[id] ?? favoriteIds.has(id),
      };
    });
  }, [importantProducts, favoriteState, favoriteIds]);

  const productsList = useMemo(() => {
    return products.map((product) => {
      const id = getProductId(product);

      return {
        ...product,
        isFavorite: favoriteState[id] ?? favoriteIds.has(id),
      };
    });
  }, [products, favoriteState, favoriteIds]);

  const toggleFavorite = async (productId, currentIsFavorite) => {
    const id = String(productId);

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

    if (loadingProductId === id) return;

    const previousState = favoriteState[id] ?? Boolean(currentIsFavorite);

    const nextState = !previousState;

    // Optimistic update
    setFavoriteState((prev) => ({
      ...prev,
      [id]: nextState,
    }));

    setLoadingProductId(id);

    try {
      if (nextState) {
        await SlugMethods("favorites", "POST", {
          product: id,
        });

        setToast({
          message:
            locale === "ar"
              ? "تمت إضافة المنتج إلى المفضلة"
              : "Product added to favorites",
          type: "success",
        });
      } else {
        await SlugMethods(`favorites?where[product][equals]=${id}`, "DELETE");

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
        [id]: previousState,
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

  const websiteName =
    locale === "en"
      ? dataBySlug.headerTwo.websiteName
      : dataBySlug.headerTwo.websiteNameAr;

  return (
    <>
      <div className="w-full mb-10">
        <ProductSlug
          data={currentProduct}
          locale={locale}
          products={productsList}
          onToggleFavorite={toggleFavorite}
          loadingProductId={loadingProductId}
          rightSideImage={rightSideImage}
          pageData={pageData}
        />

        <div className="h-full w-full">
          <HeaderTwo
            onToggleFavorite={toggleFavorite}
            loadingProductId={loadingProductId}
            importantProducts={importantList}
            src={HERO_VIDEO_URL}
            onAddToCart={handleAddToCart}
            favoriteState={favoriteState}
            websiteName={websiteName}
            locale={locale}
            secondHeader={dataBySlug.headerTwo}
          />
        </div>
      </div>

      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            message: null,
          }))
        }
      />
    </>
  );
};

export default ProductSlugClient;
