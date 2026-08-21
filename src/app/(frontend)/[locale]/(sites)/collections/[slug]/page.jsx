import React from "react";
import GetFilteredData from "@/actions/GetFilteredData";
import CollectionElements from "@/components/ui/CollectionPage/CollectionElements";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import { getUser } from "@/actions/getUser";

const page = async ({ params, searchParams }) => {
  const param = await params;
  const query = await searchParams;

  const locale = param.locale;
  const slug = param.slug;

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
  console.log(products);

  return (
    <div className="border-t mt-20 border-base-border w-full">
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

export default page;
