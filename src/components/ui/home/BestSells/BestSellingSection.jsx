"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Links from "@/components/shared/Links/Links";
import Image from "next/image";
import ProductCard from "../Products/ProductsCard";
import ProductModal from "@/components/shared/Model/ProductModal";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";

const BestSellingSection = ({
  data,
  locale,
  onToggleFavorite,
  loadingProductId,
  onAddToCart,
  bestSellingSectionData,
  websiteName,
}) => {
  const t = useTranslations("BestSeller");
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const BestSellingSectionTitle =
    locale === "en"
      ? bestSellingSectionData?.title
      : bestSellingSectionData?.titleAr;

  const BestSellingSectionDes =
    locale === "en"
      ? bestSellingSectionData?.des
      : bestSellingSectionData?.desAr;

  const BestSellingSectionImage =
    bestSellingSectionData?.ImageSource === "Url"
      ? bestSellingSectionData?.ImageUrl
      : bestSellingSectionData?.ImageUpload?.url;
  useLockBodyScroll(openModel);

  return (
    <>
      <div className="container-custom p-4 ">
        <div className="flex md:flex-row gap-4 flex-col justify-between w-full items-center">
          <div className="flex flex-col justify-center gap-4 ">
            <p className="Coffetitle">{websiteName}</p>
            <p className="CoffeDiscription font-bold">
              {BestSellingSectionTitle}
            </p>
            <p className="w-full md:max-w-sm text-base">
              {BestSellingSectionDes}
            </p>
            <Links text={t("showProducts")} targetLink={"products"} />
          </div>
          <div className="lg:w-75 lg:h-75 md:h-50 md:w-50 flex justify-center">
            <Image
              src={BestSellingSectionImage}
              width={300}
              height={300}
              className="object-contain"
              alt="Coffee Image"
            />
          </div>
          <div className="flex w-full md:max-w-1/3">
            {data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                setOpenModel={setOpenModel}
                setSelectedProduct={setSelectedProduct}
                toggleFavorite={() =>
                  onToggleFavorite(product.id, product.isFavorite)
                }
                isLoading={loadingProductId === product.id}
                onAddToCart={onAddToCart}
              />
            ))}
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

export default BestSellingSection;
