import React from "react";
import GetAllData from "@/actions/GetAllData";
import Collection from "@/components/ui/CollectionPage/Collection";
import Header from "@/components/shared/Headers/Header";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

const Page = async ({ params, searchParams }) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const categories = await GetDataWithPagination("categories", currentPage, 5);
  const categoriesData = await GetAllData("globals/collections", true);

  const CategoriesPageData = categoriesData?.CategoriesPageData || {};
  const title = CategoriesPageData.title;
  const titleAr = CategoriesPageData.titleAr;
  const des = CategoriesPageData.des;
  const desAr = CategoriesPageData.desAr;

  const backToHome =
    locale === "en" ? "Back To Home" : "الرجوع للصفحة الرئيسية";
  const allproducts = categoriesData.allProducts;

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={locale === "en" ? title : titleAr}
          des={locale === "en" ? des : desAr}
          backToHome={backToHome}
          locale={locale}
        />
      </div>
      <div className="border-t  border-base-border w-full" />
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
