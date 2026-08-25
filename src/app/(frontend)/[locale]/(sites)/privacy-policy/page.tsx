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

  const policy = await getDataCache("globals/policy");

  const isArabic = locale === "ar";

  const title = isArabic ? policy?.titleAr : policy?.title;

  const des = isArabic ? policy?.descriptionAr : policy?.description;

  const content = isArabic ? policy?.contentAr : policy?.content;

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

  const policy = await getDataCache("globals/policy");

  const isArabic = locale === "ar";

  const title = isArabic ? policy?.SEO?.metaTitleAr : policy?.SEO?.metaTitle;

  const description = isArabic
    ? policy?.SEO?.metaDescriptionAr
    : policy?.SEO?.metaDescription;

  const keywords = (
    isArabic ? policy?.SEO?.keywordsAr : policy?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    policy?.SEO?.ImageSource === "Url"
      ? policy?.SEO?.ImageUrl
      : policy?.SEO?.ImageUpload?.url;

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
