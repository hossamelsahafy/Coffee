"use client";
import React, { useState } from "react";
import DiscountBadge from "@/components/shared/BadgeDiscount";
import { useTranslations } from "next-intl";
import { CiHeart } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FiChevronsDown } from "react-icons/fi";
import { useCart } from "@/Context/CartContext";
import Image from "next/image";
import Link from "next/link";
const ProductsCardAsColomns = ({
  product,
  locale,
  setOpenModel,
  setSelectedProduct,
  isCustom,
  customBgColor,
  customHoverBgColor,
  selectedFilters,
}) => {
  const { addToCart } = useCart();
  const t = useTranslations("discountSection");
  const options = product.choices.options;
  const getInitialOption = () => {
    return options.find((o) => o.availability === "inStock") || options[0];
  };
  const [selectedOption, setSelectedOption] = useState(getInitialOption);
  const stockFilter = selectedFilters?.availability;

  const filteredOptions =
    stockFilter?.length > 0
      ? options.filter((o) => {
          if (stockFilter.includes("in_stock") && o.availability === "inStock")
            return true;

          if (
            stockFilter.includes("out_stock") &&
            o.availability === "outOfStock"
          )
            return true;

          return false;
        })
      : options;

  const safeSelectedOption =
    filteredOptions.find((o) => o.value === selectedOption?.value) ||
    filteredOptions[0];

  const isOutOfStock = safeSelectedOption?.availability === "outOfStock";

  const getDiscount = (before, after) => {
    if (!before) return 0;
    return ((before - after) / before) * 100;
  };
  return (
    <div
      className={`flex flex-col items-stretch gap-4 w-full h-full ${isCustom ? `${customBgColor} ${customHoverBgColor} duration-300 transition-all cursor-pointer` : "bg-coffeText"} rounded-lg p-4 mt-4`}
    >
      <div className="flex justify-between w-full items-start gap-2">
        <div className="flex flex-col gap-2 items-center">
          <DiscountBadge
            value={getDiscount(
              safeSelectedOption.priceBefore,
              safeSelectedOption.priceAfter,
            )}
          />
          {product.isNewest && <DiscountBadge value={t("new")} />}
        </div>

        <div className="flex max-h-50 justify-center relative h-50 w-50">
          <Image
            src={
              safeSelectedOption.ImageSource === "upload"
                ? safeSelectedOption.image.url
                : safeSelectedOption.imageUrl
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
          value={safeSelectedOption.value || safeSelectedOption.en}
          onChange={(e) =>
            setSelectedOption(
              options.find((opt) => (opt.value || opt.en) === e.target.value),
            )
          }
          className="SelectStyle"
        >
          {filteredOptions.map((opt, idx) => (
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
          <p className="priceAfter">{safeSelectedOption.priceAfter} USD</p>
          <p
            className={
              isCustom
                ? "priceBefore text-base-light! before:border-base-dark!"
                : `priceBefore`
            }
          >
            {safeSelectedOption.priceBefore} USD
          </p>
        </div>
        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product, safeSelectedOption)}
          className={`relative pb-1 whitespace-nowrap
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full 
    after:bg-base-light after:transition-all after:duration-300 sm:text-sm lg:text-base
    hover:after:bg-base-borderTwo uppercase flex items-center font-bold
     ${isOutOfStock ? "cursor-not-allowed opacity-50 disabled:opacity-50" : "cursor-pointer"}"
        `}
        >
          <FiPlus />

          {isOutOfStock
            ? locale === "en"
              ? "Sold Out"
              : "نفذت الكمية"
            : locale === "en"
              ? "Add to cart"
              : "اضف للسلة"}
        </button>
      </div>
    </div>
  );
};

export default ProductsCardAsColomns;
