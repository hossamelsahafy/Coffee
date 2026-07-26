import React from "react";
import GetAllData from "@/actions/GetAllData";
import Header from "@/components/shared/Headers/Header";
import AboutUs from "@/components/ui/AboutUsPage/AboutUs";
const page = async ({ params }) => {
  const { locale } = await params;
  const AboutData = await GetAllData("globals/about-page", true);
  const title = AboutData.title;
  const titleAr = AboutData.titleAr;
  const des = AboutData.subtitle;
  const desAr = AboutData.subtitleAr;

  const backToHome =
    locale === "en" ? "Back TO Home" : "الرجوع للصفحة الرئيسية";

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
      <div className="w-full h-auto bg-base-lighter">
        <AboutUs data={AboutData} locale={locale} />
      </div>
    </div>
  );
};

export default page;
