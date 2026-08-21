"use client";
import React, { useState } from "react";
import Video from "@/components/shared/Video/Video";
import { useTranslations } from "next-intl";
import Link from "next/link";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ProductCard from "@/components/ui/home//Products/ProductsCard";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import ProductModal from "@/components/shared/Model/ProductModal";

const HeaderTwo = ({
  locale,
  importantProducts,
  onToggleFavorite,
  loadingProductId,
  secondHeader,
  websiteName,
  onAddToCart,
}) => {
  const t = useTranslations("headerTwo");
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const secondHeadertitle =
    locale === "en" ? secondHeader?.title : secondHeader?.titleAr;

  const secondHeaderSubtitle =
    locale === "en" ? secondHeader?.subtitle : secondHeader?.subtitleAr;
  const videoSrc = secondHeader.SecondHeaderVideo;
  useLockBodyScroll(openModel);
  return (
    <>
      <div className="max-w-7xl mt-10 mx-auto p-4">
        <div className="relative w-full overflow-hidden rounded-xl text-base-light">
          <Video
            src={videoSrc}
            linear
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-20 flex md:flex-row flex-col justify-center md:justify-between items-center gap-4 p-6">
            <div className="flex flex-col justify-center items-start w-full  gap-4 min-w-1/4">
              <p className="tracking-tighter text-2xl font-bold">
                {websiteName}
              </p>

              <p className="text-2xl font-bold text-base-coffe">
                {secondHeadertitle}
              </p>

              <p className="w-full mt-4 font-semibold text-base md:max-w-md">
                {secondHeaderSubtitle}
              </p>

              <div className="group inline-block">
                <Link
                  href={`/${locale}/products`}
                  className="font-semibold relative hover:text-base-coffe duration-300 transition-all pb-1 text-lg after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-base-light after:transition-all after:duration-300 hover:after:bg-base-coffe"
                >
                  {t("showProducts")}
                </Link>
              </div>
            </div>
            <div className="relative w-full md:max-w-3/4 p-4">
              <GridSwiper
                filteredProducts={importantProducts}
                loop={false}
                totalPages={1}
                rows={1}
                breakpoints={{
                  0: { slidesPerView: 1, grid: { rows: 1 } },
                  640: { slidesPerView: 1, grid: { rows: 1 } },
                  768: { slidesPerView: 1, grid: { rows: 1 } },
                  1024: { slidesPerView: 2, grid: { rows: 1 } },
                }}
                renderItem={(product, bg) => (
                  <ProductCard
                    product={product}
                    locale={locale}
                    bg={true}
                    setOpenModel={setOpenModel}
                    setSelectedProduct={setSelectedProduct}
                    toggleFavorite={() =>
                      onToggleFavorite(product.id, product.isFavorite)
                    }
                    isLoading={loadingProductId === product.id}
                    onAddToCart={onAddToCart}
                  />
                )}
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
