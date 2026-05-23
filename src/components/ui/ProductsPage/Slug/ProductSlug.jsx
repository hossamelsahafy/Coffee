"use client";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ImageSection from "./ImageSection";
import DescriptionSection from "./DescriptionSection";
import DetailsSection from "./DetailsSection";
import RecentlyProducts from "./RecentlyProducts/RecentlyProducts";
import ReviewsSection from "./ReviewsSection/ReviewsSection";
import { FaArrowRight } from "react-icons/fa6";
const ProductSlug = ({ data, locale, products }) => {
  const t = useTranslations("productSlug");
  const options = data?.choices?.options || [];

  const [selectOption, setSelectedOption] = useState(options[0]);
  const activeOption = selectOption || options[0];
  const addtoCart = t("AddToCart");
  const BuyItNow = t("BuyItNow");
  const write = t("write");
  const Quan = t("Quantity");
  const SoldOut = t("soldout");

  return (
    <>
      <div className="container-custom p-4 ">
        <div className="flex justify-between w-full items-start gap-4">
          <Link href={`/${locale}`}>
            <div className="flex justify-start items-center gap-2">
              <div className="border border-base-light rounded-full p-2">
                {locale === "en" ? (
                  <FaArrowLeft className="text-base-light text-base" />
                ) : (
                  <FaArrowRight className="text-base-light text-base" />
                )}
              </div>
              <p>{t("button")}</p>
            </div>
          </Link>
        </div>
        <div className="flex mt-4 w-full md:flex-row flex-col items-start">
          <div className="w-full md:w-1/2">
            <ImageSection
              activeOption={activeOption}
              setSelectedOption={setSelectedOption}
              options={options}
              locale={locale}
            />
          </div>
          <DescriptionSection
            data={data}
            selectOption={selectOption}
            setSelectedOption={setSelectedOption}
            locale={locale}
            addtoCart={addtoCart}
            BuyItNow={BuyItNow}
            write={write}
            options={options}
            Quan={Quan}
            activeOption={activeOption}
            SoldOut={SoldOut}
          />
        </div>
      </div>
      <DetailsSection
        data={data}
        locale={locale}
        selectedOption={selectOption}
      />
      <RecentlyProducts products={products} locale={locale} />
      <ReviewsSection />
    </>
  );
};

export default ProductSlug;
