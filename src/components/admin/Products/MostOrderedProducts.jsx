"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MostOrderedProducts({
  data = [],
  title,
  locale = "en",
}) {
  const isArabic = locale === "ar";

  return (
    <Card className="relative transition-all ease-in-out duration-300 overflow-hidden pt-0 w-full rounded-3xl border border-white/10 bg-[#1A120D]/70 backdrop-blur-md shadow-2xl text-white">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white text-xl font-semibold">
            {title
              ? title
              : isArabic
                ? "الأكثر طلباً"
                : "Most Ordered Products"}
          </CardTitle>
          <p className="text-xs text-[#E8C6A7]/70">
            {isArabic
              ? "المنتجات والخيارات الأكثر مبيعاً في المتجر"
              : "Top performing product variants and options by unit volume"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!data || data.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-[#E8C6A7]/60">
            {isArabic
              ? "لا توجد بيانات متاحة حالياً"
              : "No ordered products data available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <div
                key={item.id ? `${item.id}-${index}` : index}
                className="flex flex-col justify-between h-full min-h-[360px] rounded-2xl border border-white/10 bg-[#2C1D15]/60 p-4 transition-all hover:border-[#C07A3B]/50 hover:bg-[#2C1D15]"
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="line-clamp-1 text-sm font-medium text-[#FFF9F0]">
                      {isArabic ? item.titleAr || item.title : item.title}
                    </h4>

                    <span className="shrink-0 rounded-lg bg-[#C07A3B] px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] text-[#E8C6A7]/60">
                      {isArabic ? item.choiceTypeAr : item.choiceType}:
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-[#E8C6A7]">
                      {item.selectedVariant}
                    </span>
                  </div>
                </div>

                <div className="relative my-4 flex-1 min-h-[220px] w-full overflow-hidden rounded-xl bg-black/30 p-2 border border-white/5">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Product Image"}
                      fill
                      className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#E8C6A7]/40">
                      {isArabic ? "لا توجد صورة" : "No Image"}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] text-[#E8C6A7]/60">
                      {isArabic ? "المبيعات" : "Sold"}
                    </p>
                    <p className="font-bold text-white">
                      {item.totalQuantitySold} {isArabic ? "قطعة" : "units"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#E8C6A7]/60">
                      {isArabic ? "الإيرادات" : "Revenue"}
                    </p>
                    <p className="font-bold text-[#D8A46B]">
                      ${item.totalRevenue?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
