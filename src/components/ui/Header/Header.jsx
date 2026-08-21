import React from "react";
import { useTranslations } from "next-intl";
import TextAnimation from "@/components/ui/animation/TextAnimation";
import Partners from "@/components/ui/home/Partners/Partners";

const Header = ({ locale, websiteName, textAnimation, PartnerSection }) => {
  const fresh = locale === "en" ? PartnerSection.title : PartnerSection.titleAr;

  const freshSpan =
    locale === "en" ? PartnerSection.subtitle : PartnerSection.subtitleAr;

  const ImageArray = PartnerSection.Images;

  const currentDate = new Date();
  const t = useTranslations("header");

  const partners = t("partners");

  return (
    <div className="absolute inset-0 w-full flex flex-col justify-center items-center z-10">
      <div className="relative w-full h-auto p-4 text-base-light flex flex-col items-center justify-center text-center">
        <div
          className={`hidden md:flex flex-col lg:p-12 items-center absolute ${
            locale === "en" ? "left-4" : "right-4"
          } top-1/2 transform -translate-y-1/2 text-2xl font-semibold`}
        >
          <div className="pb-3 flex items-center justify-center">
            <span className="[writing-mode:vertical-lr] whitespace-nowrap">
              {currentDate.getDate()}/{currentDate.getMonth() + 1}
            </span>
          </div>

          <div className="border-l border-white h-64 shrink-0" />

          <div className="pt-3 flex items-start justify-center">
            <span className="[writing-mode:vertical-lr] whitespace-nowrap">
              {websiteName}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <TextAnimation locale={locale} data={textAnimation} />
        </div>
      </div>
      <Partners
        locale={locale}
        title={websiteName}
        partners={partners}
        fresh={fresh}
        freshSpan={freshSpan}
        data={ImageArray}
      />
    </div>
  );
};

export default Header;
