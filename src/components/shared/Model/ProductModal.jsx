"use client";

import Image from "next/image";
import React, { useState } from "react";
import NormalSwiper from "../Swiper/NormalSwiper";
import ImageSlide from "./ImageSlide";
import { FaCartShopping } from "react-icons/fa6";
import { useSiteSettings } from "@/Context/CurrencyContext";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import { useCart } from "@/Context/CartContext";
const ProductModal = ({ selectedProduct, locale, setOpenModel, openModel }) => {
  const options = selectedProduct?.choices?.options || [];
  const { addToCart } = useCart();
  const getInitialOption = () => {
    return (
      options.find((option) => option.availability === "inStock") ||
      options[0] ||
      null
    );
  };

  const [toast, setToast] = useState({
    message: null,
    type: "",
  });

  const [selectedOption, setSelectedOption] = useState(getInitialOption);
  const [quantity, setQuantity] = useState(1);
  const [swiper, setSwiper] = useState(null);

  const { siteSettings } = useSiteSettings();

  const defaultBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
  };

  const imagesData =
    selectedProduct?.choices?.options?.map((option) => ({
      id:
        option.value?.id ||
        option.value ||
        option.imageUrl ||
        option.image?.url,
      image: option.ImageSource === "Url" ? option.imageUrl : option.image?.url,
      option,
    })) || [];

  const activeOption = selectedOption || options[0] || null;

  const showToast = (isInStock) => {
    setToast({
      message: isInStock
        ? locale === "ar"
          ? "تمت إضافة المنتج إلى السلة"
          : "Product added to cart"
        : locale === "ar"
          ? "المنتج غير متوفر"
          : "Product is sold out",
      type: isInStock ? "success" : "error",
    });
  };

  const handleAddToCart = () => {
    const isInStock = activeOption?.availability === "inStock";

    if (!isInStock) {
      showToast(false);
      return;
    }

    addToCart(selectedProduct, activeOption, quantity);

    showToast(true);
  };

  const handleOptionChange = (newOption) => {
    if (!newOption) return;

    setSelectedOption(newOption);
    setQuantity(1);

    const index = imagesData.findIndex(
      (image) =>
        (image.option?.value?.id || image.option?.value || image.option) ===
        (newOption?.value?.id || newOption?.value || newOption),
    );

    if (index !== -1) {
      swiper?.slideTo(index);
    }
  };

  const increase = () => {
    if (activeOption?.availability !== "inStock") return;

    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const isInStock = activeOption?.availability === "inStock";

  const soldOutText = locale === "en" ? "Sold Out" : "نفذت الكمية";

  const addToCartText = locale === "en" ? "Add To Cart" : "اضف لعربة التسوق";

  const activeValueLabel =
    locale === "en" ? activeOption?.value?.name : activeOption?.value?.nameAr;

  const currency = siteSettings?.currency?.code || "";

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/40 flex items-center justify-center
          z-50 md:w-full p-4
          transition-opacity duration-300
          ${
            openModel
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      >
        <div
          className={`
            bg-base-coffe z-40 p-6 rounded-lg relative
            w-full md:max-w-5xl mx-auto
            transition-all duration-300
            ${openModel ? "scale-100 opacity-100" : "scale-90 opacity-0"}
          `}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => {
              setOpenModel(false);
              setSelectedOption(null);
              setQuantity(1);
              setToast({
                message: null,
                type: "",
              });
            }}
            className="absolute top-2 right-2 cursor-pointer font-bold text-2xl"
          >
            ✕
          </button>

          {selectedProduct && (
            <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 w-full">
              {/* Product Images */}
              <div className="md:w-1/2 overflow-hidden">
                <NormalSwiper
                  changebg={true}
                  data={imagesData}
                  ItemComponent={ImageSlide}
                  locale={locale}
                  defaultBreakpoints={defaultBreakpoints}
                  slides={1}
                  px={"px-0"}
                  onSwiper={setSwiper}
                  loop={false}
                  autoplay={false}
                  hidden={imagesData.length <= 1}
                />
              </div>

              {/* Product Info */}
              <div className="flex w-full md:max-w-1/2 flex-col items-center md:items-start justify-center gap-4">
                {/* Title */}
                <h2 className="text-2xl font-bold text-base-dark">
                  {locale === "en"
                    ? selectedProduct?.title
                    : selectedProduct?.titleAr}
                </h2>

                {/* Subtitle */}
                <p className="text-base text-base-dark line-clamp-3">
                  {locale === "en"
                    ? selectedProduct?.subtitle
                    : selectedProduct?.subtitleAr}
                </p>

                {/* Option Type */}
                <p className="font-bold text-base text-base-dark capitalize text-start">
                  {locale === "en"
                    ? selectedProduct?.choices?.choiceType
                    : selectedProduct?.choices?.choiceTypeAr}
                  :
                  <span className="inline mx-2 font-medium">
                    {activeValueLabel}
                  </span>
                </p>

                {/* Options */}
                <div className="flex flex-row justify-start items-center gap-4">
                  {imagesData.map((item) => {
                    const isItemActive =
                      (activeOption?.value?.id ||
                        activeOption?.value ||
                        activeOption) ===
                      (item.option?.value?.id ||
                        item.option?.value ||
                        item.option);

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleOptionChange(item.option)}
                        className="cursor-pointer"
                      >
                        <Image
                          width={100}
                          height={100}
                          alt={item.option?.value?.name || "Product option"}
                          src={item.image}
                          className={`
                            object-contain rounded-md border
                            transition-all duration-200
                            ${
                              isItemActive
                                ? "border-base-light scale-105"
                                : "border-base-dark"
                            }
                          `}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Price */}
                <div className="flex gap-2 text-2xl font-bold text-base-dark">
                  <p>
                    {activeOption?.priceAfter?.toFixed(2)}
                    {currency}
                  </p>

                  {activeOption?.priceBefore && (
                    <p
                      className="
                        relative
                        before:absolute
                        before:left-0
                        before:right-0
                        before:top-1/2
                        before:border-t-2
                        before:border-base-dark
                      "
                    >
                      {activeOption?.priceBefore?.toFixed(2)}
                      {currency}
                    </p>
                  )}
                </div>

                {/* Cart Controls */}
                <div className="flex flex-wrap justify-start items-center gap-4 w-full">
                  {/* Add To Cart / Sold Out */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`
                      flex justify-center items-center
                      cursor-pointer gap-2
                      px-4 py-2 rounded-full
                      transition-all duration-300
                      ${
                        isInStock
                          ? "bg-base-dark/80 hover:bg-base-dark text-base-light"
                          : "bg-base-dark text-base-light opacity-90"
                      }
                    `}
                  >
                    {isInStock ? addToCartText : soldOutText}

                    {isInStock && (
                      <span>
                        <FaCartShopping className="text-base-light" />
                      </span>
                    )}
                  </button>

                  {/* Quantity */}
                  {isInStock && (
                    <div className="flex items-center w-24 h-10 border border-base-dark rounded-full text-base-dark overflow-hidden">
                      <button
                        type="button"
                        onClick={decrease}
                        className="flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-base-dark/10 transition"
                      >
                        -
                      </button>

                      <span className="flex-1 text-center font-bold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increase}
                        className="flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-base-dark/10 transition"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
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

export default ProductModal;
