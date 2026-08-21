import React from "react";
import Link from "next/link";

const ProductsGrid = ({ gridState, getViewCountBadge, adminRoute }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {gridState.docs.map((viewRecord) => {
        const rawProduct = viewRecord.product;
        const isProductObject =
          typeof rawProduct === "object" && rawProduct !== null;

        const productId = isProductObject ? rawProduct.id : rawProduct;
        const productTitle = isProductObject
          ? rawProduct.title || rawProduct.name || "Product Item"
          : "Product Record";

        const productTitleAr = isProductObject ? rawProduct.titleAr : null;
        const productSubtitle = isProductObject ? rawProduct.subtitle : null;

        const categoryName =
          isProductObject && typeof rawProduct.category === "object"
            ? rawProduct.category?.title || rawProduct.category?.name
            : null;

        const isBestSeller = isProductObject && rawProduct.isBestSeller;
        const isNewest = isProductObject && rawProduct.isNewest;
        const isImportant = isProductObject && rawProduct.important;
        const isDiscounted =
          isProductObject && rawProduct.ShowInDiscountSection;

        const choices = isProductObject ? rawProduct.choices : null;
        const choiceType = choices?.choiceType;
        const options = choices?.options || [];

        const lastViewedDate =
          viewRecord.updatedAt || viewRecord.createdAt
            ? new Date(
                viewRecord.updatedAt || viewRecord.createdAt,
              ).toLocaleDateString()
            : "--";

        return (
          <div
            key={viewRecord.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10! bg-white/5! p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/50! hover:bg-white/10! hover:shadow-xl hover:shadow-[#6F3F1C]/20!"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C07A3B]/10! blur-2xl transition-all duration-300 group-hover:bg-[#C07A3B]/20" />

            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {categoryName && (
                    <span className="text-xs text-[#E8C6A7]/80! uppercase tracking-wider font-semibold">
                      {categoryName}
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-col gap-1.5 shrink-0">
                  <div className="flex items-center flex-col gap-1.5 shrink-0">
                    {getViewCountBadge(
                      viewRecord.favoriteCount ?? viewRecord.views ?? 1,
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-300!">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-bold text-white! transition-colors group-hover:text-[#D8A46B]! truncate">
                    {productTitle}
                  </h3>
                  {productTitleAr && (
                    <p className="text-xs text-[#E8C6A7]/70! dir-rtl text-right font-medium truncate">
                      {productTitleAr}
                    </p>
                  )}
                  {productSubtitle && (
                    <p className="text-xs text-gray-400! line-clamp-1 italic mt-1">
                      {productSubtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-1 min-h-6.5">
                  {isBestSeller && (
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      Best Seller
                    </span>
                  )}
                  {isNewest && (
                    <span className="rounded-md border border-sky-500/30 bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                      New Arrival
                    </span>
                  )}
                  {isImportant && (
                    <span className="rounded-md border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                      Featured
                    </span>
                  )}
                  {isDiscounted && (
                    <span className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      On Sale
                    </span>
                  )}
                </div>

                {options.length > 0 && (
                  <div className="space-y-2 mt-auto border-t border-white/5! pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400! capitalize">
                        Options ({choiceType || "Variants"})
                      </span>
                      <span className="text-[#D8A46B]! font-medium">
                        {options.length} Available
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-32 overflow-y-auto rounded-xl border border-white/5! bg-black/20! p-2.5">
                      {options.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-white/5! bg-white/5! px-2.5 py-1.5 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-medium text-white! truncate block">
                              {opt.value} / {opt.valueAr}
                            </span>
                            <span
                              className={`text-[10px] ${
                                opt.availability === "inStock"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {opt.availability === "inStock"
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-[#D8A46B]! block">
                              ${opt.priceAfter}
                            </span>
                            {opt.priceBefore > opt.priceAfter && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ${opt.priceBefore}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Views */}
                <div className="flex items-center justify-between border-t border-white/5! pt-3">
                  <span className="text-gray-400!">Total Views Logged</span>
                  <span className="font-bold text-[#D8A46B]!">
                    {viewRecord.views ?? 1}
                  </span>
                </div>

                {/* Last Active */}
                <div className="flex items-center justify-between border-t border-white/5! pt-3">
                  <span className="text-gray-400!">Last Active</span>
                  <span className="font-medium text-xs text-[#E8C6A7]/80!">
                    {lastViewedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-between items-center border-t border-white/10! pt-4 gap-2">
              {productId ? (
                <Link
                  href={`${adminRoute}/collections/products/${productId}`}
                  className="w-full text-center rounded-xl border border-[#C07A3B]/30! bg-[#6F3F1C]/40! px-4 py-2 text-xs font-medium text-[#E8C6A7]! shadow-sm transition-all hover:bg-[#C07A3B]! hover:text-white!"
                >
                  Manage Product
                </Link>
              ) : (
                <span className="text-xs text-gray-500 italic text-center w-full">
                  Unlinked Product
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;
