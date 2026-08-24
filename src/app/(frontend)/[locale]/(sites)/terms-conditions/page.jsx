import React from "react";
import Header from "@/components/shared/Headers/Header";
import GetAllData from "@/actions/GetAllData";
import { RichText } from "@payloadcms/richtext-lexical/react";

const page = async ({ params }) => {
  const { locale } = await params;
  const termsAndConditions = await GetAllData(
    "globals/terms-and-conditions",
    true,
  );
  const title = termsAndConditions.title;
  const titleAr = termsAndConditions.titleAr;
  const des = termsAndConditions.description;
  const desAr = termsAndConditions.descriptionAr;
  const backToHome =
    locale === "en" ? "Back To Home" : "الرجوع للصفحة الرئيسية";

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={locale === "en" ? title : titleAr}
          des={locale === "en" ? des : desAr}
          backToHome={backToHome}
          locale={locale}
        />
      </div>
      <div className="w-full border-t border-base-border" />
      <div className="container-custom p-4 mt-10">
        <RichText
          data={
            locale === "en"
              ? termsAndConditions.content
              : termsAndConditions.contentAr
          }
        />
      </div>
    </div>
  );
};

export default page;
