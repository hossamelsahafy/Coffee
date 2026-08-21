import React from "react";
import MainPage from "@/components/ui/ProductsPage/MainPage";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import GetDataWithPagination from "@/actions/GetDataWithPagination"; // Import pagination helper
import { getUser } from "@/actions/getUser";

type Props = {
  params: {
    locale: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
  };
};

const page = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const currentSort = resolvedSearchParams?.sort || "-createdAt";

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

  const CurrentLocation = locale === "en" ? "All Products" : "جميع المنتجات";

  return (
    <div id="productPage" className="border-t mt-20 border-base-border w-full">
      <MainPage dataLength={productsData.totalDocs} locale={locale} />
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

export default page;
