import type { Metadata } from "next";
import React from "react";

import GetFilteredData from "@/actions/GetFilteredData";
import CollectionElements from "@/components/ui/CollectionPage/CollectionElements";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import { getUser } from "@/actions/getUser";
import { GetDataBySlugCache } from "@/lib/GetDataBySlugCache";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const category = await GetDataBySlugCache("categories", slug, locale);

  if (!category) {
    return {};
  }

  const isArabic = locale === "ar";

  const title =
    (isArabic ? category.seo?.metaTitleAr : category.seo?.metaTitle) ||
    (isArabic ? category.titleAr : category.title);

  const description =
    (isArabic
      ? category.seo?.metaDescriptionAr
      : category.seo?.metaDescription) ||
    (isArabic ? category.descriptionAr : category.description);

  const keywords = isArabic ? category.seo?.keywordsAr : category.seo?.keywords;

  let image: string | undefined;

  if (category.seo?.ImageSource === "Url") {
    image = category.seo?.ImageUrl;
  } else if (category.seo?.ImageUpload?.url) {
    image = category.seo.ImageUpload.url;
  }

  return {
    title,
    description,

    ...(keywords?.length
      ? {
          keywords,
        }
      : {}),

    openGraph: {
      type: "website",
      title,
      description,
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image
        ? {
            images: [image],
          }
        : {}),
    },
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const { locale, slug } = await params;
  const query = await searchParams;

  const currentPage = Number(query?.page) || 1;
  const currentSort = query?.sort || "-createdAt";

  const user = await getUser();

  const favorites = user
    ? await GetDataServerSide("favorites?depth=1", "GET")
    : null;

  const result = await GetFilteredData({
    collection: "products",
    filterKey: locale === "en" ? "category.slug" : "category.slugAr",
    filterValue: decodeURIComponent(slug),
    page: currentPage,
    limit: 9,
    sort: currentSort,
  });

  const products = result.docs;

  const paginationInfo = {
    totalPages: result?.totalPages || 1,
    page: result?.page || 1,
  };

  const currentLocation =
    locale === "en"
      ? products[0]?.category?.title
      : products[0]?.category?.titleAr;

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <CollectionElements data={products} locale={locale} />

      <div className="w-full bg-base-lighter min-h-screen">
        <FiltersAndProductsSection
          locale={locale}
          CurrentLocation={currentLocation}
          products={products}
          userFavorites={favorites}
          paginationInfo={paginationInfo}
          currentSort={currentSort}
        />
      </div>
    </div>
  );
};

export default Page;
