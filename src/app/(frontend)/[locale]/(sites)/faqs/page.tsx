import type { Metadata } from "next";

import Header from "@/components/shared/Headers/Header";
import Faqs from "@/components/ui/FAQs/Faqs";

import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const FAQs = await getDataCache("globals/faqs");

  const isArabic = locale === "ar";

  const title = isArabic ? FAQs?.titleAr : FAQs?.titleEn;

  const des = isArabic ? FAQs?.descriptionAr : FAQs?.descriptionEn;

  const FAQsData = FAQs?.faqItems;

  const backToHome = isArabic ? "الرجوع للصفحة الرئيسية" : "Back To Home";

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={title}
          des={des}
          backToHome={backToHome}
          locale={locale}
          length={false}
        />
      </div>

      <div className="border-t border-base-nav w-full" />

      <div className="w-full h-auto">
        <Faqs data={FAQsData} locale={locale} />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const FAQs = await getDataCache("globals/faqs");

  const isArabic = locale === "ar";

  const title = isArabic ? FAQs?.SEO?.metaTitleAr : FAQs?.SEO?.metaTitle;

  const description = isArabic
    ? FAQs?.SEO?.metaDescriptionAr
    : FAQs?.SEO?.metaDescription;

  const keywords = (
    isArabic ? FAQs?.SEO?.keywordsAr : FAQs?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    FAQs?.SEO?.ImageSource === "Url"
      ? FAQs?.SEO?.ImageUrl
      : FAQs?.SEO?.ImageUpload?.url;

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
