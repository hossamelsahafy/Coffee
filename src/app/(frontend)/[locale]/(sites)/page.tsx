import Video from "@/components/shared/Video/Video";
import Header from "@/components/ui/Header/Header";
import SubscripeSection from "@/components/ui/home/SubscripeSection/SubscripeSection";
import NotesSection from "@/components/ui/home/NotesSection/NotesSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import HomePageClient from "@/components/ui/home/HomePageClient";
import GetFilteredData from "@/actions/GetFilteredData";
import { getUser } from "@/actions/getUser";
import GetReviews from "@/actions/GetReviews";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import { getDataCache } from "@/lib/GetDataCache";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: {
    page?: string;
    sort?: string;
  };
};

interface Product {
  id: number;
  title: string;
  important: boolean;
  isNew: boolean;
  ShowInDiscountSection: boolean;
  isBestSeller: boolean;
  isFavorite?: boolean;
}

interface Note {
  id: number;
  isImportant: boolean;
}

interface Country {
  id: number;
}

export default async function Home({ params, searchParams }: Props) {
  const { locale } = await params;
  const user = await getUser();

  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const currentSort = resolvedSearchParams?.sort || "-createdAt";
  const Countries = await GetFilteredData({
    collection: "countries",
    limit: 5,
    sort: "-reviewCount",
  });

  const [
    Categories,
    products,
    importantProducts,
    bestSellingProducts,
    discountProducts,
    Notes,
    homePage,
    userFavorites,
  ] = await Promise.all([
    GetFilteredData({
      collection: "categories",
      filterKey: "showInHomePage",
      filterValue: true,
      limit: 10,
    }),

    GetDataWithPagination("products", currentPage, 6, currentSort, {}, true, 2),
    GetFilteredData({
      collection: "products",
      filterKey: "important",
      filterValue: true,
      limit: 10,
      depth: 3,
      useCookies: true,
    }),
    GetFilteredData({
      collection: "products",
      filterKey: "isBestSeller",
      filterValue: true,
      limit: 10,
      depth: 3,
      useCookies: true,
    }),
    GetFilteredData({
      collection: "products",
      filterKey: "ShowInDiscountSection",
      filterValue: true,
      limit: 12,
      depth: 3,
      useCookies: true,
    }),

    GetFilteredData({
      collection: "Notes",
      filterKey: "isImportant",
      filterValue: true,
      limit: 10,
    }),

    getDataCache("globals/home-page"),
    user
      ? GetDataServerSide("favorites?depth=1", "GET")
      : Promise.resolve(null),
  ]);

  const reviewsResults = await Promise.all(
    Countries.docs.map(async (country: Country) => {
      const data = await GetReviews({
        countryId: country.id,
        page: 1,
        limit: 2,
      });
      return {
        countryId: country.id,
        docs: data.docs || [],
        totalPages: data.totalPages || 1,
        hasNextPage: data.hasNextPage || false,
        hasPrevPage: data.hasPrevPage || false,
        totalDocs: data.totalDocs || 0,
      };
    }),
  );

  const reviewsByCountry = reviewsResults.reduce((acc, curr) => {
    acc[curr.countryId] = curr;
    return acc;
  }, {});
  const favoriteIds = new Set(
    Array.isArray(userFavorites?.docs)
      ? userFavorites.docs
          .map((doc: any) => String(doc?.product?.id ?? doc?.product))
          .filter(Boolean)
      : [],
  );

  const addFavoriteState = (product: Product) => ({
    ...product,
    isFavorite: favoriteIds.has(String(product.id)),
  });

  const productsWithFavorites = products.docs.map(addFavoriteState);

  const importantProductsWithFavorites =
    importantProducts.docs.map(addFavoriteState);

  const discountProductsWithFavorites =
    discountProducts.docs.map(addFavoriteState);

  const bestSellingProductsWithFavorites =
    bestSellingProducts.docs.map(addFavoriteState);
  const productsPaginationMeta = {
    totalPages: products.totalPages || 1,
    page: products.page || 1,
    totalDocs: products.totalDocs || 0,
    hasNextPage: products.hasNextPage || false,
    hasPrevPage: products.hasPrevPage || false,
  };
  const CategoriesReversed = [...Categories.docs].reverse();
  const importantNotes = Notes.docs;

  const videoSrc = homePage?.HeaderVideo;
  const websiteName =
    locale === "en" ? homePage?.websiteName : homePage?.websiteNameAr;
  const textAnimation = homePage?.TextOverVideo;

  const PartnerSection = homePage?.Partner;
  const SecondHeaderSection = homePage?.SecondHeader;
  const ReviewsSection = homePage?.ReviewsSection;
  const discountSection = homePage?.discountSection;
  const BestSellingSection = homePage?.BestSellingSection;
  const BannerSection = homePage?.BannerSection;
  const NoteSection = homePage?.NotesSection;

  return (
    <main className="h-full">
      <div className="relative w-full min-h-screen">
        <div className="absolute inset-0 w-full h-full object-cover z-0">
          <Video src={videoSrc} linear={true} rounded="" />
        </div>
      </div>
      <Header
        locale={locale}
        websiteName={websiteName}
        textAnimation={textAnimation}
        PartnerSection={PartnerSection}
      />

      <HomePageClient
        initialProducts={productsWithFavorites}
        categories={CategoriesReversed}
        locale={locale}
        websiteName={websiteName}
        SecondHeaderSection={SecondHeaderSection}
        ReviewsSectionData={ReviewsSection}
        discountSection={discountSection}
        BestSellingSectionData={BestSellingSection}
        countries={Countries}
        initialReviewsMap={reviewsByCountry}
        importantProducts={importantProductsWithFavorites}
        discountProducts={discountProductsWithFavorites}
        bestSellingProducts={bestSellingProductsWithFavorites}
        productsPagesData={productsPaginationMeta}
      />
      <SubscripeSection
        locale={locale}
        websiteName={websiteName}
        BannerSection={BannerSection}
      />
      <NotesSection
        locale={locale}
        data={importantNotes}
        NoteSection={NoteSection}
        websiteName={websiteName}
      />
    </main>
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const homePage = await getDataCache("globals/home-page");

  const isArabic = locale === "ar";

  const title = isArabic
    ? homePage?.SEO?.metaTitleAr
    : homePage?.SEO?.metaTitle;

  const description = isArabic
    ? homePage?.SEO?.metaDescriptionAr
    : homePage?.SEO?.metaDescription;

  const keywords = (
    isArabic ? homePage?.SEO?.keywordsAr : homePage?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    homePage?.SEO?.ImageSource === "Url"
      ? homePage?.SEO?.ImageUrl
      : homePage?.SEO?.ImageUpload?.url;

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
