"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsCardAsColomns from "@/components/shared/Products/ProductsCardAsColomns";

export function MostViewedProducts({
  data = [],
  onToggleFavorite,
  loadingProductId,
  setOpenModel,
  setSelectedProduct,
}) {
  const t = useTranslations("UserDashboard");
  const locale = useLocale();
  console.log(data);

  return (
    <>
      <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A120D]/70 text-white backdrop-blur-md shadow-2xl">
        <CardHeader className="border-b border-white/10 py-5">
          <CardTitle className="text-xl font-semibold text-white">
            {t("MostViewedProducts")}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-4">
          {!Array.isArray(data) || data.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center text-sm text-gray-400">
              {t("noProductsFound")}
            </div>
          ) : (
            <div className="grid grid-cols-1 backdrop- gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => {
                const product = item.product || item;
                const isCurrentlyLoading = loadingProductId === product.id;

                return (
                  <ProductsCardAsColomns
                    key={product.id || item.id}
                    product={product}
                    locale={locale}
                    isCustom={true}
                    customBgColor="bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg"
                    setSelectedProduct={setSelectedProduct}
                    setOpenModel={setOpenModel}
                    toggleFavorite={() =>
                      onToggleFavorite?.(product.id, product.isFavorite)
                    }
                    isLoading={isCurrentlyLoading}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
