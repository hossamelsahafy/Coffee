import React from "react";
import { useTranslations } from "next-intl";

export default function TrackOrderData({ locale, order }) {
  const t = useTranslations("TrackOrderData");

  if (!order) return null;

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#C07A3B]/10 blur-2xl pointer-events-none" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {t("orderNumber")}
        </span>
        <div className="mt-4">
          <span className="text-lg md:text-xl font-bold text-[#D8A46B] tracking-tight truncate block">
            {order.orderNumber}
          </span>
        </div>
      </div>

      <div className="bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#C07A3B]/10 blur-2xl pointer-events-none" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {t("totalAmount")}
        </span>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white">
            {order.total}
          </span>
          <span className="text-xs text-[#D8A46B] font-medium">
            {order.currency || "USD"}
          </span>
        </div>
      </div>

      <div className="bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#C07A3B]/10 blur-2xl pointer-events-none" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {t("shippingCost")}
        </span>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white">
            {order.shipping.price}
          </span>
          <span className="text-xs text-[#D8A46B] font-medium">
            {order.currency || "USD"}
          </span>
        </div>
      </div>

      <div className="bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#C07A3B]/10 blur-2xl pointer-events-none" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {t("shippingCountry")}
        </span>
        <div className="mt-4">
          <span className="text-lg md:text-xl font-bold text-gray-200 block truncate">
            {locale === "en"
              ? order.shipping.zone.cityName
              : order.shipping.zone.cityNameAr}
          </span>
        </div>
      </div>
    </div>
  );
}
