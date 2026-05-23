"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Links from "@/components/shared/Links/Links";
import NormalSwiper from "@/components/shared/Swiper/NormalSwiper";
import ProductCardAsColomns from "@/components/shared/Products/ProductsCardAsColomns";
import ProductModal from "@/components/shared/Model/ProductModal";
import { useParams } from "next/navigation";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const DisCountSection = ({ data }) => {
  const t = useTranslations("discountSection");
  const { locale } = useParams();
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
    <>
      <div className="container-custom p-4 ">
        <div className="flex w-full md:flex-row flex-col md:justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="Coffetitle">{t("coffee")}</p>
            <p className="CoffeDiscription font-bold">
              {t("coffeeShopBestDiscountProducts")}
            </p>
          </div>
          <Links text={t("showMoreProducts")} />
        </div>
        <NormalSwiper
          breakpoints={defaultBreakpoints}
          px="px-0"
          data={data}
          ItemComponent={({ item }) => (
            <div className="flex flex-col justify-center items-center gap-4 w-full">
              <ProductCardAsColomns
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
    </>
  );
};

export default DisCountSection;
