"use client";
import React, { useState, useEffect } from "react";
import DiscountBadge from "@/components/shared/BadgeDiscount";
import { useTranslations } from "next-intl";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { FiPlus, FiLoader } from "react-icons/fi";
import { FiChevronsDown } from "react-icons/fi";
import { useCart } from "@/Context/CartContext";
import Image from "next/image";
import Link from "next/link";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";

const ProductsCardAsColomns = ({
  product,
  locale,
  setOpenModel,
  setSelectedProduct,
  isCustom,
  customBgColor,
  customHoverBgColor,
  selectedFilters,
  toggleFavorite,
  isLoading,
  onAddToCart,
  isFavorite,
}) => {
  const { user } = useUser();
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
    filteredOptions.find(
      (o) =>
        (o.value?.id || o.value) ===
        (selectedOption?.value?.id || selectedOption?.value),
    ) || filteredOptions[0];

  const isOutOfStock = safeSelectedOption?.availability === "outOfStock";

  const getDiscount = (before, after) => {
    if (!before) return 0;
    return ((before - after) / before) * 100;
  };

  const handleViewed = async () => {
    if (user) {
      try {
        await SlugMethods("auth/track-products", "POST", {
          productId: product.id,
        });
      } catch (error) {
        console.error("Failed to track product view:", error);
      }
    }
  };

  const currentImageSrc =
    safeSelectedOption?.ImageSource === "upload"
      ? safeSelectedOption?.image?.url
      : safeSelectedOption?.imageUrl;

  const [displayImage, setDisplayImage] = useState(currentImageSrc);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (currentImageSrc !== displayImage) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayImage(currentImageSrc);
        setIsFading(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentImageSrc, displayImage]);

  return (
    <div
      className={`flex flex-col items-stretch gap-4 w-full h-full ${isCustom ? `${customBgColor} ${customHoverBgColor} duration-300 transition-all cursor-pointer` : "bg-coffeText"} rounded-lg p-4 mt-4`}
    >
      <div className="flex justify-between w-full items-start gap-2">
        <div className="flex flex-col gap-2 items-center">
          <DiscountBadge
            value={getDiscount(
              safeSelectedOption?.priceBefore || 0,
              safeSelectedOption?.priceAfter || 0,
            )}
          />
          {product.isNewest && <DiscountBadge value={t("new")} />}
        </div>

        <div className="flex max-h-50 justify-center relative h-50 w-50">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className={`object-contain transition-opacity duration-300 ease-in-out ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
            sizes="200px"
          />
        </div>

        <div className="flex flex-col justify-center gap-2 items-center">
          <button
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (toggleFavorite) toggleFavorite();
            }}
            className="cursor-pointer block my-2 disabled:opacity-50"
            aria-label="Toggle Favorite"
          >
            {isLoading ? (
              <FiLoader className="text-sm animate-spin text-base-light" />
            ) : isFavorite ? (
              <FaHeart className="text-sm text-base-lighter" />
            ) : (
              <FaRegHeart className="text-sm text-base-light" />
            )}
          </button>

          <FaRegEye
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleViewed();
              setSelectedProduct(product);
              setOpenModel(true);
            }}
            className="text-lg font-bold cursor-pointer"
          />
        </div>
      </div>
      <Link
        onClick={() => handleViewed()}
        href={`/${locale}/products/${locale === "en" ? product.slug : product.slugAr}`}
      >
        <p className="font-bold text-2xl line-clamp-1 hover:text-base-light/70 duration-300 transition-all">
          {locale === "en" ? product.title : product.titleAr}
        </p>
      </Link>
      <div className="relative w-full">
        <select
          value={
            safeSelectedOption?.value?.id ||
            safeSelectedOption?.value ||
            safeSelectedOption?.en
          }
          onChange={(e) =>
            setSelectedOption(
              options.find(
                (opt) =>
                  (opt.value?.id || opt.value || opt.en) === e.target.value,
              ),
            )
          }
          className="SelectStyle"
        >
          {filteredOptions.map((opt, idx) => {
            const optVal = opt.value?.id || opt.value || opt.en;
            const optLabel =
              locale === "en"
                ? opt.value?.title || opt.value?.name || opt.value || opt.en
                : opt.value?.titleAr ||
                  opt.value?.nameAr ||
                  opt.ar ||
                  opt.valueAr;

            return (
              <option className="text-base-dark" key={idx} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <FiChevronsDown
          className={`absolute ${locale === "en" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 pointer-events-none text-base-light scale-x-150`}
        />
      </div>
      <div className="flex justify-between w-full items-center font-bold">
        <div className="block">
          <p className="priceAfter">{safeSelectedOption?.priceAfter} USD</p>
          <p
            className={
              isCustom
                ? "priceBefore text-base-light! before:border-base-dark!"
                : `priceBefore`
            }
          >
            {safeSelectedOption?.priceBefore} USD
          </p>
        </div>
        <button
          disabled={isOutOfStock}
          onClick={async () => {
            if (isOutOfStock) {
              onAddToCart?.(false);
              return;
            }

            await addToCart(product, selectedOption);
            onAddToCart?.(true);
          }}
          className={`relative pb-1 whitespace-nowrap
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full
    after:bg-base-light after:transition-all after:duration-300
    hover:text-base-dark duration-300 transition-all
    after:pointer-events-none
    sm:text-sm lg:text-base
    hover:after:bg-base-borderTwo uppercase flex items-center font-bold
    ${isOutOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
