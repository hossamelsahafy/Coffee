"use client";

import React, { useMemo } from "react";
import { useConfig, useListQuery, usePayloadAPI } from "@payloadcms/ui";
import Link from "next/link";
import Pagination from "@/components/shared/AdminUI/Pagination";
import ProductsFilteringAndSorting from "./ProductsFilteringAndSorting";

export const ProductsCustomGrid = () => {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const {
    data,
    isLoading,
    handlePageChange,
    handleSortChange,
    handleWhereChange,
  } = useListQuery({});

  const [{ data: categoriesData }] = usePayloadAPI(
    "/api/categories?limit=0&depth=0",
  );

  const categoryMap = useMemo(() => {
    const map = new Map();
    categoriesData?.docs?.forEach((cat) => {
      map.set(cat.id, cat.title);
    });
    return map;
  }, [categoriesData]);

  const products = data?.docs || [];
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 1;
  const hasPrevPage = data?.hasPrevPage || false;
  const hasNextPage = data?.hasNextPage || false;
  const onPageChange = (newPage) => {
    if (typeof handlePageChange === "function") {
      handlePageChange(newPage);
    }
  };

  return (
    <>
      <div className="p-4 font-sans min-h-screen text-[#fff9f0]!">
        <ProductsFilteringAndSorting
          products={products}
          handleSortChange={handleSortChange}
          handleWhereChange={handleWhereChange}
          adminRoute={adminRoute}
          categories={categoriesData?.docs || []}
        />
        {isLoading ? (
          <div className="flex justify-center items-center h-48 text-[#e2cca6]/60!">
            Fetching products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-[#e2cca6]/60 bg-[#2c1d15]! border border-[#6b4a37]/50! rounded-xl">
            No coffee products found matching your search.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const categoryId =
                  typeof product.category === "object"
                    ? product.category?.id
                    : product.category;

                const categoryTitle =
                  typeof product.category === "object" &&
                  product.category?.title
                    ? product.category.title
                    : categoryMap.get(categoryId) || "--";
                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10! bg-white/5! p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/50! hover:bg-white/10! hover:shadow-xl hover:shadow-[#6F3F1C]/20!"
                  >
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C07A3B]/10! blur-2xl transition-all duration-300 group-hover:bg-[#C07A3B]/20" />

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-white! transition-colors group-hover:text-[#D8A46B]!">
                            {product.title}
                          </h3>

                          {product.titleAr && (
                            <p className="text-sm text-[#E8C6A7]/70! dir-rtl">
                              {product.titleAr}
                            </p>
                          )}

                          {product.subtitle && (
                            <p className="mt-1 text-sm text-gray-400!">
                              {product.subtitle}
                              {product.subtitleAr && (
                                <span className="text-[#E8C6A7]/60!">
                                  {" "}
                                  ({product.subtitleAr})
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          {product.isBestSeller && (
                            <span className="rounded-full border border-amber-500/30! bg-amber-500/20! px-2.5 py-1 text-[11px] font-semibold text-amber-300!">
                              Best Seller
                            </span>
                          )}

                          {product.important && (
                            <span className="rounded-full border border-purple-500/30! bg-purple-500/20! px-2.5 py-1 text-[11px] font-semibold text-purple-300!">
                              Featured
                            </span>
                          )}

                          {product.ShowInDiscountSection && (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                              Discount
                            </span>
                          )}

                          {product.isNewest && (
                            <span className="rounded-full border border-sky-500/30! bg-sky-500/20! px-2.5 py-1 text-[11px] font-semibold text-sky-300!">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-gray-300!">
                        <div className="flex items-center justify-between border-t border-white/5! pt-3 mt-4 text-sm">
                          <span className="text-gray-400!">Category</span>
                          <span className="font-medium text-gray-200!">
                            {categoryTitle}
                          </span>
                        </div>

                        {product.choices?.choiceType && (
                          <div className="flex items-center justify-between border-t border-white/5! pt-3">
                            <span className="text-gray-400!">Type</span>
                            <span className="font-medium text-gray-200!">
                              {product.choices.choiceType}
                            </span>
                          </div>
                        )}

                        {product.choices?.options && (
                          <>
                            <div className="flex items-center justify-between border-t border-white/5! pt-3">
                              <span className="text-gray-400!">Variants</span>
                              <span className="font-medium text-[#D8A46B]!">
                                {product.choices.options.length}
                              </span>
                            </div>

                            <div className="space-y-2 max-h-44 overflow-y-auto rounded-xl border border-white/5! bg-black/20! p-3">
                              {product.choices.options.map((option, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between rounded-lg border border-white/5! bg-white/5! px-3 py-2"
                                >
                                  <div>
                                    <p className="font-medium text-white!">
                                      {option.value}
                                      {option.valueAr && (
                                        <span className="text-[#E8C6A7]/60!">
                                          {" "}
                                          / {option.valueAr}
                                        </span>
                                      )}
                                    </p>

                                    <span
                                      className={`text-xs ${
                                        option.availability === "inStock"
                                          ? "text-emerald-400!"
                                          : "text-rose-400!"
                                      }`}
                                    >
                                      {option.availability === "inStock"
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </span>
                                  </div>

                                  <div className="text-right">
                                    <p className="font-bold text-[#D8A46B]!">
                                      ${option.priceAfter}
                                    </p>

                                    {option.priceBefore > option.priceAfter && (
                                      <p className="text-xs text-gray-500! line-through">
                                        ${option.priceBefore}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-white/10! pt-4">
                      <Link
                        href={`${adminRoute}/collections/products/${product.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#C07A3B]/30! bg-[#6F3F1C]/40! px-4 py-2 text-sm font-medium text-[#E8C6A7]! shadow-sm transition-all hover:bg-[#C07A3B]! hover:text-white!"
                      >
                        Edit Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ProductsCustomGrid;
