import type { Metadata } from "next";
import React from "react";

import { GetDataBySlugCache } from "@/lib/GetDataBySlugCache";
import GetFilteredData from "@/actions/GetFilteredData";
import ProductSlugClient from "@/components/ui/ProductsPage/Slug/ProductSlugClient";
import { getUser } from "@/actions/getUser";
import GetDataServerSide from "@/actions/GetDataServerSide";
import GetAllData from "@/actions/GetAllData";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const product = await GetDataBySlugCache("products", slug, locale);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const isArabic = locale === "ar";

  const title =
    (isArabic ? product.seo?.metaTitleAr : product.seo?.metaTitle) ||
    (isArabic ? product.titleAr : product.title);

  const description =
    (isArabic
      ? product.seo?.metaDescriptionAr
      : product.seo?.metaDescription) ||
    (isArabic ? product.descriptionAr : product.description);

  const keywords = isArabic ? product.seo?.keywordsAr : product.seo?.keywords;

  let image: string | undefined;

  if (product.seo?.ImageSource === "Url") {
    image = product.seo?.ImageUrl;
  } else if (product.seo?.ImageUpload?.url) {
    image = product.seo.ImageUpload.url;
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

const Page = async ({ params }: Props) => {
  const { locale, slug: slugName } = await params;

  const user = await getUser();

  const favorites = user
    ? await GetDataServerSide("favorites?depth=1", "GET")
    : null;

  const dataBySlug = await GetDataBySlugCache("products", slugName, locale);

  const products = await GetFilteredData({
    collection: "products",
    filterKey: "ShowInDiscountSection",
    slugName,
    filterValue: true,
  });

  const importantProducts = await GetFilteredData({
    collection: "products",
    filterKey: "important",
    slugName: "",
    filterValue: true,
    limit: 10,
  });
  const HERO_VIDEO_URL = dataBySlug.headerTwo.HeaderTwoVideo;
  const rightSideImage =
    dataBySlug.headerTwo.ImageSource === "Url"
      ? dataBySlug.headerTwo.rightSideImageUrl
      : dataBySlug.headerTwo.rightSideImage.url;

  return (
    <div className="border-t p-4 w-full mt-28 border-base-border">
      <ProductSlugClient
        importantProducts={importantProducts.docs}
        locale={locale}
        dataBySlug={dataBySlug}
        products={products.docs}
        userFavorites={favorites}
        HERO_VIDEO_URL={HERO_VIDEO_URL}
        rightSideImage={rightSideImage}
        pageData={dataBySlug.headerTwo}
      />
    </div>
  );
};

export default Page;
