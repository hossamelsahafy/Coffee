"use client";
import React, { useState } from "react";
import DiscountBadge from "@/components/shared/BadgeDiscount";
import { useTranslations } from "next-intl";
import { CiHeart } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FiChevronsDown } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";
const ProductsCardAsColomns = ({
  product,
  locale,
  setOpenModel,
  setSelectedProduct,
}) => {
  const t = useTranslations("discountSection");
  const options = product.choices.options;
  const [selectedOption, setSelectedOption] = useState(options?.[0]);
  const getDiscount = (before, after) => {
    if (!before) return 0;
    return ((before - after) / before) * 100;
  };

  return (
    <div className="flex flex-col items-stretch gap-4 w-full h-full bg-coffeText rounded-lg p-4 mt-4">
      <div className="flex justify-between w-full items-start gap-2">
        <div className="flex flex-col gap-2 items-center">
          <DiscountBadge
            value={getDiscount(
              selectedOption.priceBefore,
              selectedOption.priceAfter,
            )}
          />
          {product.isNewest && <DiscountBadge value={t("new")} />}
        </div>

        <div className="flex max-h-50 justify-center relative h-50 w-50">
          <Image
            src={
              selectedOption.ImageSource === "upload"
                ? selectedOption.image.url
                : selectedOption.imageUrl
            }
            alt={product.title}
            fill
            className="object-contain"
            sizes="200px"
          />
        </div>

        <div className="flex flex-col justify-center gap-2 items-center">
          <CiHeart className="text-lg font-bold" />

          <FaRegEye
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedProduct(product);
              setOpenModel(true);
            }}
            className="text-lg font-bold cursor-pointer"
          />
        </div>
      </div>
      <Link
        href={`/${locale}/products/${locale === "en" ? product.slug : product.slugAr}`}
      >
        <p className="font-bold text-2xl line-clamp-1 hover:text-base-light/70 duration-300 transition-all">
          {locale === "en" ? product.title : product.titleAr}
        </p>
      </Link>
      <div className="relative w-full">
        <select
          value={selectedOption.value || selectedOption.en}
          onChange={(e) =>
            setSelectedOption(
              options.find((opt) => (opt.value || opt.en) === e.target.value),
            )
          }
          className="SelectStyle"
        >
          {options.map((opt, idx) => (
            <option
              className="text-base-dark"
              key={idx}
              value={opt.value || opt.en}
            >
              {locale === "en" ? opt.value || opt.en : opt.ar || opt.valueAr}
            </option>
          ))}
        </select>
        <FiChevronsDown
          className={`absolute ${locale === "en" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 pointer-events-none text-base-light scale-x-150`}
        />
      </div>
      <div className="flex justify-between w-full items-center font-bold">
        <div className="block">
          <p className="priceAfter">{selectedOption.priceAfter} USD</p>
          <p className="priceBefore">{selectedOption.priceBefore} USD</p>
        </div>
        <button
          className="relative pb-1 whitespace-nowrap
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full 
                    after:bg-base-light after:transition-all after:duration-300 sm:text-sm lg:text-base
                    hover:after:bg-base-borderTwo cursor-pointer uppercase flex items-center font-bold"
        >
          <FiPlus />
          {locale === "en" ? "add to cart" : "اضف للسلة"}
        </button>
      </div>
    </div>
  );
};

export default ProductsCardAsColomns;
