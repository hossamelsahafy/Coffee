"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ReviewsForm from "./ReviewsForm";

const ReviewsSection = ({
  productID,
  selectedOption,
  locale,
  setToast,
  countriesData,
}) => {
  const t = useTranslations("ReviewsSection");

  const writeAReview = t("Write");
  const closeFormText = t("CloseForm");

  const [isOpen, setIsOpen] = useState(false);

  const style =
    "px-6 py-2 hover:bg-base-lighter transition-all text-center duration-300 font-bold bg-base-coffe text-base-dark rounded-full cursor-pointer";

  const handleSuccess = (message) => {
    setToast({
      message,
      type: "success",
    });

    setIsOpen(false);
  };

  const handleError = (message) => {
    setToast({
      message,
      type: "error",
    });
  };

  return (
    <>
      <div id="review" className="container-custom">
        <h2 className="text-2xl font-bold">{t("H2")}</h2>

        <div className="flex w-full justify-between max-w-2xl gap-4 items-center mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Image
                    src="/assets/icons8star49.png"
                    width={20}
                    height={20}
                    alt="stars image"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            <p className="font-semibold">{t("BeFirst")}</p>
          </div>

          <button
            type="button"
            className={style}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? closeFormText : writeAReview}
          </button>
        </div>

        <div
          className={`overflow-hidden w-full transition-all duration-500 ease-in-out ${
            isOpen
              ? "max-h-250 opacity-100 translate-y-0 mt-4"
              : "max-h-0 opacity-0 -translate-y-3 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-4xl mx-auto">
            <ReviewsForm
              productID={productID}
              selectedOption={selectedOption}
              locale={locale}
              onSuccess={handleSuccess}
              onError={handleError}
              countriesData={countriesData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsSection;
