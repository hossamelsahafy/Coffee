import type { Metadata } from "next";
import Header from "@/components/shared/Headers/Header";
import AboutUs from "@/components/ui/AboutUsPage/AboutUs";
import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const AboutData = await getDataCache("globals/about-page");

  const title = AboutData.title;
  const titleAr = AboutData.titleAr;

  const des = AboutData.subtitle;
  const desAr = AboutData.subtitleAr;

  const backToHome =
    locale === "en" ? "Back TO Home" : "الرجوع للصفحة الرئيسية";

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4">
        <Header
          title={locale === "en" ? title : titleAr}
          des={locale === "en" ? des : desAr}
          backToHome={backToHome}
          locale={locale}
          length={""}
        />
      </div>

      <div className="w-full h-auto bg-base-lighter">
        <AboutUs data={AboutData} locale={locale} />
      </div>
    </div>
  );
};

export default Page;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const AboutData = await getDataCache("globals/about-page");

  const isArabic = locale === "ar";

  const title = isArabic
    ? AboutData?.SEO?.metaTitleAr
    : AboutData?.SEO?.metaTitle;

  const description = isArabic
    ? AboutData?.SEO?.metaDescriptionAr
    : AboutData?.SEO?.metaDescription;

  const keywords = (
    isArabic ? AboutData?.SEO?.keywordsAr : AboutData?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    AboutData?.SEO?.ImageSource === "Url"
      ? AboutData?.SEO?.ImageUrl
      : AboutData?.SEO?.ImageUpload?.url;

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
