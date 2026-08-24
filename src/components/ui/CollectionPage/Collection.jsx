"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import CollectionCard from "./CollectionCard";
import CollectionSkelaton from "./CollectionSkelaton";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

const Collection = ({ data, pagination, locale, allProducts }) => {
  const t = useTranslations("Collection");

  const [isPending, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [collections, setCollections] = useState(data);
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 1);

  const totalProductsCount = allProducts?.productsCount || 0;

  const image =
    allProducts?.ImageSource === "Url"
      ? allProducts?.ImageUrl
      : allProducts?.ImageUpload?.url;

  const ProductsData = {
    id: "All_products",
    imageUrl: image,
    title: allProducts?.title,
    titleAr: allProducts?.titleAr,
    slug: allProducts?.slug,
    slugAr: allProducts?.slugAr,
    productsCount: totalProductsCount,
  };

  const dataWithAllProducts = [ProductsData, ...collections];

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isPending) return;

    setIsLoadingPage(true);

    startTransition(async () => {
      try {
        const result = await GetDataWithPagination("categories", newPage, 5);
        setCollections(result.docs);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
      } finally {
        setIsLoadingPage(false);
      }
    });
  };

  return (
    <div id="products-section" className="container-custom p-4">
      <div className="flex flex-col justify-center items-center mt-10 w-full">
        <h2 className="text-4xl font-bold text-base-coffe mb-8">
          {t("Collections")}
        </h2>

        <div className="w-full relative min-h-[300px]">
          {isLoadingPage ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <CollectionSkelaton key={index} />
              ))}
            </div>
          ) : (
            <GridSwiper
              filteredProducts={dataWithAllProducts}
              enablePagePagination={true}
              makeBulletsWhilePagePagination={true}
              totalPages={totalPages}
              errorMessage={
                locale === "en"
                  ? "No collections Was Found"
                  : "لم يتم العثور على مجموعات"
              }
              currentPage={currentPage}
              onPageChange={handlePageChange}
              renderItem={(item) => (
                <CollectionCard item={item} locale={locale} />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
