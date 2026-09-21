import type { Metadata } from "next";

import Collection from "@/components/ui/CollectionPage/Collection";
import Header from "@/components/shared/Headers/Header";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const isArabic = locale === "ar";

  const categories = await GetDataWithPagination("categories", currentPage, 5);

  const categoriesData = await getDataCache("globals/collections");

  const CategoriesPageData = categoriesData?.CategoriesPageData || {};

  const title = isArabic
    ? CategoriesPageData?.titleAr
    : CategoriesPageData?.title;

  const des = isArabic ? CategoriesPageData?.desAr : CategoriesPageData?.des;

  const backToHome = isArabic ? "الرجوع للصفحة الرئيسية" : "Back To Home";

  const allproducts = categoriesData?.allProducts;

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

      <div className="border-t border-base-border w-full" />

      <div className="container-custom p-4">
        <Collection
          data={categories.docs}
          locale={locale}
          pagination={{
            page: categories.page,
            totalPages: categories.totalPages,
            hasNextPage: categories.hasNextPage,
            hasPrevPage: categories.hasPrevPage,
            totalDocs: categories.totalDocs,
          }}
          allProducts={allproducts}
        />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const categoriesData = await getDataCache("globals/collections");

  const isArabic = locale === "ar";

  const title = isArabic
    ? categoriesData?.SEO?.metaTitleAr
    : categoriesData?.SEO?.metaTitle;

  const description = isArabic
    ? categoriesData?.SEO?.metaDescriptionAr
    : categoriesData?.SEO?.metaDescription;

  const keywords = (
    isArabic ? categoriesData?.SEO?.keywordsAr : categoriesData?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    categoriesData?.SEO?.ImageSource === "Url"
      ? categoriesData?.SEO?.ImageUrl
      : categoriesData?.SEO?.ImageUpload?.url;

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
