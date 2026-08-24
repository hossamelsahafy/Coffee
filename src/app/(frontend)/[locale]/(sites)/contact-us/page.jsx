import React from "react";
import GetAllData from "@/actions/GetAllData";
import Header from "@/components/shared/Headers/Header";
import ContactUs from "@/components/ui/ContactUsPage/ContactUs";
const page = async ({ params }) => {
  const { locale } = await params;
  const ContactUsData = await GetAllData("globals/contact-us-page", true);
  const title = ContactUsData.title;
  const titleAr = ContactUsData.titleAr;
  const des = ContactUsData.subtitle;
  const desAr = ContactUsData.subtitleAr;

  const backToHome =
    locale === "en" ? "Back To Home" : "الرجوع للصفحة الرئيسية";

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
      <div className="w-full h-full bg-base-lighter">
        <ContactUs data={ContactUsData} locale={locale} />
      </div>
    </div>
  );
};

export default page;
