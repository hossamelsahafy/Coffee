"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import NormalSwiper from "@/components/shared/Swiper/NormalSwiper";
import ProductsCardAsColomns from "@/components/shared/Products/ProductsCardAsColomns";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import ProductModal from "@/components/shared/Model/ProductModal";

const RecentlyProducts = ({ products, locale }) => {
  const t = useTranslations("RecentlySection");

  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const defaultBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  };
  useLockBodyScroll(openModel);
  return (
    <div className="container-custom">
      <h2 className="text-4xl font-bold text-center mt-10">{t("H2")}</h2>
      <div className="w-full overflow-hidden">
        <NormalSwiper
          breakpoints={defaultBreakpoints}
          px="px-0"
          data={products}
          ItemComponent={({ item }) => (
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <ProductsCardAsColomns
                product={item}
                locale={locale}
                setOpenModel={setOpenModel}
                setSelectedProduct={setSelectedProduct}
              />
            </div>
          )}
        />
      </div>
      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />
    </div>
  );
};

export default RecentlyProducts;
