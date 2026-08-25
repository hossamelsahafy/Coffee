import type { Metadata } from "next";

import Header from "@/components/shared/Headers/Header";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const termsAndConditions = await getDataCache("globals/terms-and-conditions");

  const isArabic = locale === "ar";

  const title = isArabic
    ? termsAndConditions?.titleAr
    : termsAndConditions?.title;

  const des = isArabic
    ? termsAndConditions?.descriptionAr
    : termsAndConditions?.description;

  const content = isArabic
    ? termsAndConditions?.contentAr
    : termsAndConditions?.content;

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

      <div className="w-full border-t border-base-border" />

      <div className="container-custom p-4 mt-10">
        <RichText data={content} />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const termsAndConditions = await getDataCache("globals/terms-and-conditions");

  const isArabic = locale === "ar";

  const title = isArabic
    ? termsAndConditions?.SEO?.metaTitleAr
    : termsAndConditions?.SEO?.metaTitle;

  const description = isArabic
    ? termsAndConditions?.SEO?.metaDescriptionAr
    : termsAndConditions?.SEO?.metaDescription;

  const keywords = (
    isArabic
      ? termsAndConditions?.SEO?.keywordsAr
      : termsAndConditions?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    termsAndConditions?.SEO?.ImageSource === "Url"
      ? termsAndConditions?.SEO?.ImageUrl
      : termsAndConditions?.SEO?.ImageUpload?.url;

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
