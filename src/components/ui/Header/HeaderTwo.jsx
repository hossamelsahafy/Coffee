"use client";

import React, { useState } from "react";
import Video from "@/components/shared/Video/Video";
import { useTranslations } from "next-intl";
import Link from "next/link";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ProductCard from "@/components/ui/home/Products/ProductsCard";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import ProductModal from "@/components/shared/Model/ProductModal";

const SWIPER_BREAKPOINTS = {
  0: {
    slidesPerView: 1,
    grid: { rows: 1 },
  },
  768: {
    slidesPerView: 1,
    grid: { rows: 1 },
  },
  1024: {
    slidesPerView: 2,
    grid: { rows: 1 },
  },
};

const HeaderTwo = ({
  locale,
  importantProducts,
  onToggleFavorite,
  loadingProductId,
  secondHeader,
  websiteName,
  onAddToCart,
  favoriteState,
  src,
}) => {
  const t = useTranslations("headerTwo");
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const secondHeaderTitle =
    locale === "en" ? secondHeader?.title : secondHeader?.titleAr;
  const secondHeaderSubtitle =
    locale === "en" ? secondHeader?.subtitle : secondHeader?.subtitleAr;
  const videoSrc = secondHeader?.SecondHeaderVideo || src;

  useLockBodyScroll(openModel);

  const renderProductCard = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      locale={locale}
      bg={true}
      setOpenModel={setOpenModel}
      setSelectedProduct={setSelectedProduct}
      isFavorite={favoriteState[product.id] ?? product.isFavorite ?? false}
      toggleFavorite={() =>
        onToggleFavorite(
          product.id,
          favoriteState[product.id] ?? product.isFavorite ?? false,
        )
      }
      isLoading={loadingProductId === product.id}
      onAddToCart={onAddToCart}
    />
  );

  return (
    <>
      <div className="max-w-7xl mt-10 mx-auto p-4">
        <div className="relative w-full overflow-hidden rounded-xl text-base-light">
          <Video
            src={videoSrc}
            linear
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-20 grid grid-cols-1 md:grid-cols-[40%_60%] items-center gap-6 p-6 md:p-8">
            <div className="min-w-0 flex flex-col justify-center items-start gap-4">
              <p className="tracking-tighter text-2xl font-bold">
                {websiteName}
              </p>

              <p className="text-2xl font-bold text-base-coffe">
                {secondHeaderTitle}
              </p>

              <p className="w-full max-w-md mt-2 font-semibold text-base">
                {secondHeaderSubtitle}
              </p>

              <Link
                href={`/${locale}/products`}
                className="
                  relative w-fit pb-1 text-lg font-semibold
                  transition-all duration-300
                  hover:text-base-coffe
                  after:absolute after:left-0 after:bottom-0
                  after:h-px after:w-full
                  after:bg-base-light
                  after:transition-all after:duration-300
                  hover:after:bg-base-coffe
                "
              >
                {t("showProducts")}
              </Link>
            </div>

            <div className="min-w-0 w-full overflow-hidden">
              <GridSwiper
                filteredProducts={importantProducts}
                loop={true}
                totalPages={1}
                rows={1}
                breakpoints={SWIPER_BREAKPOINTS}
                renderItem={renderProductCard}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />
    </>
  );
};

export default HeaderTwo;
