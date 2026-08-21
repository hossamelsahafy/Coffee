import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import FormSection from "./FormSection";
const SubscripeSection = ({ locale, BannerSection, websiteName }) => {
  const t = useTranslations("supscripe");
  const subscripeText = t("subscripe");
  const placeholder = t("placeholder");
  const src =
    BannerSection.ImageSource === "Url"
      ? BannerSection.ImageUrl
      : BannerSection.ImageUpload.url;
  const title = locale === "en" ? BannerSection.title : BannerSection.titleAr;
  const span =
    locale === "en" ? BannerSection.spanTitle : BannerSection.spanTitleAr;
  const des = locale === "en" ? BannerSection.des : BannerSection.desAr;

  return (
    <div className="relative container-custom my-4 p-4 ">
      <div className="relative w-full h-75 rounded-2xl overflow-hidden">
        <Image
          src={src}
          alt="subscribe banner"
          fill
          className={`object-cover ${locale === "ar" ? "scale-x-[-1]" : ""}`}
          priority
        />
      </div>
      <div className="absolute flex flex-col gap-4 inset-0 text-start w-full justify-center items-start p-6">
        <p className="Coffetitle">{websiteName}</p>
        <span>
          <p className="text-2xl font-semibold">{title}</p>
          <p className="CoffeDiscription font-bold">{span}</p>
        </span>
        <p className="w-full md:max-w-lg text-base font-semibold">{des}</p>
        <FormSection
          SubscripeText={subscripeText}
          placeholder={placeholder}
          locale={locale}
        />
      </div>
    </div>
  );
};

export default SubscripeSection;
