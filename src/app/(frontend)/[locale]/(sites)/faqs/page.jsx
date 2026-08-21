import React from "react";
import GetAllData from "@/actions/GetAllData";
import Header from "@/components/shared/Headers/Header";
import Faqs from "@/components/ui/FAQs/Faqs";
const page = async ({ params }) => {
  const { locale } = await params;
  const FAQs = await GetAllData("globals/faqs", true);

  const title = FAQs.titleEn;
  const titleAr = FAQs.titleAr;
  const des = FAQs.descriptionEn;
  const desAr = FAQs.descriptionAr;

  const backToHome =
    locale === "en" ? "Back To Home" : "الرجوع للصفحة الرئيسية";
  const FAQsData = FAQs.faqItems;
  return (
    <div className="border-t mt-24 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={locale === "en" ? title : titleAr}
          des={locale === "en" ? des : desAr}
          backToHome={backToHome}
          locale={locale}
        />
      </div>
      <div className="w-full h-auto">
        <Faqs data={FAQsData} locale={locale} />
      </div>
    </div>
  );
};

export default page;
