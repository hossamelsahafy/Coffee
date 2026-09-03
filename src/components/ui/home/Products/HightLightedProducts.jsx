"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "./ProductsCard";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ProductModal from "@/components/shared/Model/ProductModal";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

const HightLightedProducts = ({
  categories = [],
  products = [],
  onToggleFavorite,
  loadingProductId,
  productsPagesData,
  onAddToCart,
  favoriteState = {},
}) => {
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  let { locale } = useParams();

  const [currentPage, setCurrentPage] = useState(productsPagesData?.page || 1);
  const [totalPages, setTotalPages] = useState(
    productsPagesData?.totalPages || 1,
  );
  const [currentProducts, setCurrentProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState("all");

  const fetchProducts = async (pageToFetch, categoryId) => {
    setIsLoading(true);

    try {
      const queryParams =
        categoryId === "all"
          ? {}
          : {
              category: {
                equals: categoryId,
              },
            };

      const data = await GetDataWithPagination(
        "products",
        pageToFetch,
        6,
        "",
        queryParams,
      );

      setCurrentProducts(data.docs || []);
      if (data.totalPages !== undefined) {
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch filtered page data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCategoryChange = (catId) => {
    if (catId === active) return;

    setActive(catId);
    setCurrentPage(1);

    fetchProducts(1, catId);
  };

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isLoading) return;

    setCurrentPage(newPage);
    fetchProducts(newPage, active);
  };

  const allCategories = [
    { id: "all", title: "All Products", titleAr: "كل المنتجات" },
    ...categories,
  ];

  useLockBodyScroll(openModel);

  return (
    <>
      <div
        id="products-section"
        className="w-full md:max-w-7xl md:mx-auto flex flex-col text-base-light relative p-4 justify-center items-center"
      >
        <div className="flex md:flex-row justify-start flex-col md:justify-between w-full gap-4 items-center">
          <div className="flex justify-start md:justify-center items-center flex-wrap font-semibold gap-4">
            {allCategories.map((cat) => {
              const isActive = active === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="relative cursor-pointer group"
                >
                  <span
                    className={`
                    relative pb-1
                    ${
                      isActive ? "after:w-full" : "after:w-0"
                    } after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:bg-base-light after:transition-all after:duration-300 group-hover:after:w-full text-lg
                  `}
                  >
                    {locale === "en" ? cat.title : cat.titleAr}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="group inline-block">
            <Link
              href={`/${locale}/products`}
              className="font-semibold relative hover:text-base-coffe duration-300 transition-all pb-1 text-lg after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-base-light after:transition-all after:duration-300 hover:after:bg-base-coffe"
            >
              {locale === "en" ? "Show Products" : "عرض المنتجات"}
            </Link>
          </div>
        </div>

        <div className="w-full">
          <GridSwiper
            filteredProducts={currentProducts}
            enablePagePagination={true}
            makeBulletsWhilePagePagination={true}
            ChunkSize={6}
            loop={false}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            renderItem={(product) => (
              <ProductCard
                product={product}
                locale={locale}
                setOpenModel={setOpenModel}
                setSelectedProduct={setSelectedProduct}
                isFavorite={
                  favoriteState[product.id] ?? product.isFavorite ?? false
                }
                toggleFavorite={() =>
                  onToggleFavorite(
                    product.id,
                    favoriteState[product.id] ?? product.isFavorite ?? false,
                  )
                }
                isLoading={loadingProductId === product.id}
                onAddToCart={onAddToCart}
              />
            )}
          />
        </div>
      </div>

      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />
    </>
  );
};

export default HightLightedProducts;
