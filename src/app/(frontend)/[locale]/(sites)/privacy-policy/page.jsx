import React from "react";
import Header from "@/components/shared/Headers/Header";
import GetAllData from "@/actions/GetAllData";
import { RichText } from "@payloadcms/richtext-lexical/react";

const page = async ({ params }) => {
  const { locale } = await params;
  const Policy = await GetAllData("globals/policy", true);
  const title = Policy.title;
  const titleAr = Policy.titleAr;
  const des = Policy.description;
  const desAr = Policy.descriptionAr;
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
        <RichText data={locale === "en" ? Policy.content : Policy.contentAr} />
      </div>
    </div>
  );
};

export default page;
