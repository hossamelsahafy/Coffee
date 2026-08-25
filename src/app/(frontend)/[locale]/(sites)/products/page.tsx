import type { Metadata } from "next";

import MainPage from "@/components/ui/ProductsPage/MainPage";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import { getUser } from "@/actions/getUser";
import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const currentSort = resolvedSearchParams?.sort || "-createdAt";

  const isArabic = locale === "ar";

  const productsPage = await getDataCache("globals/products-page");

  const title = isArabic ? productsPage?.titleAr : productsPage?.title;

  const des = isArabic
    ? productsPage?.descriptionAr
    : productsPage?.description;

  const user = await getUser();

  const favorites = user
    ? await GetDataServerSide("favorites?depth=1", "GET")
    : null;

  const productsData = await GetDataWithPagination(
    "products",
    currentPage,
    9,
    currentSort,
  );

  const CurrentLocation = isArabic ? "جميع المنتجات" : "All Products";

  return (
    <div id="productPage" className="border-t mt-28 border-base-border w-full">
      <MainPage
        dataLength={productsData.totalDocs}
        locale={locale}
        title={title}
        des={des}
      />

      <div className="w-full bg-base-lighter min-h-screen">
        <FiltersAndProductsSection
          locale={locale}
          CurrentLocation={CurrentLocation}
          products={productsData.docs}
          userFavorites={favorites}
          paginationInfo={{
            totalPages: productsData.totalPages,
            page: productsData.page,
          }}
          currentSort={currentSort}
        />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const productsPage = await getDataCache("globals/products-page");

  const isArabic = locale === "ar";

  const title = isArabic
    ? productsPage?.SEO?.metaTitleAr
    : productsPage?.SEO?.metaTitle;

  const description = isArabic
    ? productsPage?.SEO?.metaDescriptionAr
    : productsPage?.SEO?.metaDescription;

  const keywords = (
    isArabic ? productsPage?.SEO?.keywordsAr : productsPage?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    productsPage?.SEO?.ImageSource === "Url"
      ? productsPage?.SEO?.ImageUrl
      : productsPage?.SEO?.ImageUpload?.url;

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
