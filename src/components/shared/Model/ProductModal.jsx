"use client";
import Image from "next/image";
import React, { useState } from "react";
import NormalSwiper from "../Swiper/NormalSwiper";
import ImageSlide from "./ImageSlide";
import { FaCartShopping } from "react-icons/fa6";

const ProductModal = ({ selectedProduct, locale, setOpenModel, openModel }) => {
  const options = selectedProduct?.choices?.options || [];

  const [selectOption, setSelectedOption] = useState(options[0]);
  const [quantity, setQuantity] = useState(1);
  const [swiper, setSwiper] = useState(null);
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
    selectedProduct?.choices?.options?.map((opt) => ({
      id: opt.imageUrl || opt.image.url,
      image: opt.ImageSource === "Url" ? opt.imageUrl : opt.image?.url,
      option: opt,
    })) || [];
  const activeOption = selectOption || options[0];
  const increase = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  return (
    <div
      className={`
        fixed inset-0 bg-black/40 flex items-center justify-center z-50 md:w-full p-4
        transition-opacity duration-300
        ${openModel ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
      `}
    >
      <div
        className={`
          bg-base-coffe z-40 p-6 rounded-lg relative w-full md:max-w-5xl mx-auto
          transition-all duration-300
          ${openModel ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >
        <button
          onClick={() => {
            setOpenModel(false);
            setSelectedOption(null);
          }}
          className="absolute top-2 right-2 cursor-pointer font-bold text-2xl"
        >
          ✕
        </button>

        {selectedProduct && (
          <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 w-full">
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
              />
            </div>
            <div className="flex  w-full md:max-w-1/2 flex-col items-center md:items-start justify-center gap-4">
              <h2 className="text-4xl font-bold text-base-dark line-clamp-1">
                {locale === "en"
                  ? selectedProduct?.title
                  : selectedProduct?.titleAr}
              </h2>
              <p className="text-base text-base-dark line-clamp-3">
                {locale === "en"
                  ? selectedProduct?.longDes
                  : selectedProduct?.longDesAr}
              </p>
              <p className="font-bold text-base text-base-dark capitalize text-start">
                {locale === "en"
                  ? selectedProduct?.choices?.choiceType
                  : selectedProduct?.choices?.choiceTypeAr}
                :
                <span className="inline mx-2 font-medium">
                  {locale === "en"
                    ? activeOption?.value
                    : activeOption?.valueAr}
                </span>
              </p>
              <div className="flex flex-row justify-start items-center gap-4">
                {imagesData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedOption(item.option);

                      const index = imagesData.findIndex(
                        (img) => img.option?.id === item.option?.id,
                      );

                      swiper?.slideTo(index);
                    }}
                    className="cursor-pointer"
                  >
                    <Image
                      width={100}
                      height={100}
                      alt="image"
                      src={item.image}
                      className={`object-contain rounded-md border transition
  
  ${activeOption?.id === item.option?.id ? "border-base-light scale-105" : "border-base-dark"}
`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 text-2xl font-bold text-base-dark">
                <p className="">{activeOption?.priceAfter.toFixed(2)}USD</p>
                <p className="relative before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t-2 before:border-base-dark">
                  {activeOption?.priceBefore.toFixed(2)}USD
                </p>
              </div>
              <div className="flex justify-start gap-4">
                <button className="flex  justify-center items-center cursor-pointer gap-2 px-4 py-2 rounded-full bg-base-dark/80 hover:bg-base-dark transition-all duration-300 text-base-light">
                  {locale === "en" ? "Add To Cart" : "اضف لعربة التسوق"}
                  <span className="">
                    <FaCartShopping className="text-base-light" />
                  </span>
                </button>
                <button className="flex items-center w-24 border border-base-dark rounded-full text-base-light">
                  <span
                    className="flex-1 text-center cursor-pointer"
                    onClick={() => decrease()}
                  >
                    -
                  </span>
                  <span className="flex-1 text-center font-bold">
                    {quantity}
                  </span>
                  <span
                    className="flex-1 text-center cursor-pointer"
                    onClick={() => increase()}
                  >
                    +
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
