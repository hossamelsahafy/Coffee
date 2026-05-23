import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
const DetailsSection = ({ data, locale, selectedOption }) => {
  const t = useTranslations("DetailsSection");
  return (
    <div className="container-custom">
      <div className="flex flex-col mt-10 md:flex-row w-full justify-between items-center gap-4">
        <div className="flex flex-col gap-4 justify-center items-start w-full md:max-w-1/2">
          <h2 className="Coffetitle">{t("Coffee")}</h2>
          <h4 className="text-4xl font-bold">{t("Des")}</h4>
          <p className="text-base font-semibold">{t("longDes")}</p>
          <div className="grid grid-cols-2 gap-4 w-full md:whitespace-normal whitespace-nowrap">
            <p>
              {t("sku")}: <span className="mx-2">{data?.id?.slice(4)}</span>
            </p>

            <p>
              {t("category")}:
              <span className="mx-2">
                {locale == "en"
                  ? data?.category?.title
                  : data?.category?.titleAr}
              </span>
            </p>

            <p>
              {t("type")}:
              <span className="mx-2">
                {locale == "en" ? data?.type : data?.typeAr}
              </span>
            </p>

            <p>
              {t("availability")}:
              <span className="mx-2">
                {locale === "en"
                  ? selectedOption?.availability === "inStock"
                    ? "In Stock"
                    : "Out Of Stock"
                  : selectedOption?.availability === "inStock"
                    ? "متوفر"
                    : "غير متوفر"}
              </span>
            </p>
          </div>
        </div>
        <div className="md:max-w-1/2">
          <Image
            src={"/assets/abt-2.webp"}
            width={400}
            height={400}
            alt="Cover Image"
            className="w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
