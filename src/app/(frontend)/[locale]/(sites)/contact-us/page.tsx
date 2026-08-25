import type { Metadata } from "next";

import Header from "@/components/shared/Headers/Header";
import ContactUs from "@/components/ui/ContactUsPage/ContactUs";
import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const ContactUsData = await getDataCache("globals/contact-us-page");

  const isArabic = locale === "ar";

  const title = isArabic ? ContactUsData?.titleAr : ContactUsData?.title;

  const des = isArabic ? ContactUsData?.subtitleAr : ContactUsData?.subtitle;

  const backToHome = isArabic ? "الرجوع للصفحة الرئيسية" : "Back To Home";

  return (
    <div className="border-t mt-24 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={title}
          des={des}
          backToHome={backToHome}
          locale={locale}
          length={false}
        />
      </div>

      <div className="w-full h-full bg-base-lighter">
        <ContactUs data={ContactUsData} locale={locale} />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const ContactUsData = await getDataCache("globals/contact-us-page");

  const isArabic = locale === "ar";

  const title = isArabic
    ? ContactUsData?.SEO?.metaTitleAr
    : ContactUsData?.SEO?.metaTitle;

  const description = isArabic
    ? ContactUsData?.SEO?.metaDescriptionAr
    : ContactUsData?.SEO?.metaDescription;

  const keywords = (
    isArabic ? ContactUsData?.SEO?.keywordsAr : ContactUsData?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    ContactUsData?.SEO?.ImageSource === "Url"
      ? ContactUsData?.SEO?.ImageUrl
      : ContactUsData?.SEO?.ImageUpload?.url;

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      type: "website",
      ...(image ? { images: [image] } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
