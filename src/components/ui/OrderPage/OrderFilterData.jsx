"use client";

import React from "react";
import { FiSearch, FiFilter, FiCreditCard } from "react-icons/fi";

const OrdersFilterBar = ({
  locale,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
}) => {
  const isAr = locale === "ar";

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full bg-base-dark/30 backdrop-blur-xl border border-base-nav/30 p-4 rounded-2xl shadow-lg mb-6">
      <div className="relative w-full md:flex-1">
        <FiSearch
          className={`absolute top-1/2 -translate-y-1/2 text-base-light/60 ${
            isAr ? "right-4" : "left-4"
          }`}
        />
        <input
          type="text"
          placeholder={
            isAr ? "البحث برقم الطلب..." : "Search by order number..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-base-dark/50 border border-base-nav/40 rounded-xl py-2.5 text-sm text-base-light focus:outline-none focus:border-primary transition-all ${
            isAr ? "pr-11 pl-4" : "pl-11 pr-4"
          }`}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-base-dark/50 border border-base-nav/40 rounded-xl px-3 py-2 w-full sm:w-auto md:min-w-[180px]">
          <FiFilter className="text-base-light/60 text-sm shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-base-light focus:outline-none cursor-pointer w-full"
          >
            <option value="" className="bg-base-dark text-base-light">
              {isAr ? "جميع الحالات" : "All Statuses"}
            </option>
            <option value="pending" className="bg-base-dark text-base-light">
              {isAr ? "قيد الانتظار" : "Pending"}
            </option>
            <option value="processing" className="bg-base-dark text-base-light">
              {isAr ? "قيد المعالجة" : "Processing"}
            </option>
            <option value="shipped" className="bg-base-dark text-base-light">
              {isAr ? "تم الشحن" : "Shipped"}
            </option>
            <option value="delivered" className="bg-base-dark text-base-light">
              {isAr ? "تم التوصيل" : "Delivered"}
            </option>
            <option value="cancelled" className="bg-base-dark text-base-light">
              {isAr ? "ملغي" : "Cancelled"}
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-base-dark/50 border border-base-nav/40 rounded-xl px-3 py-2 w-full sm:w-auto md:min-w-[180px]">
          <FiCreditCard className="text-base-light/60 text-sm shrink-0" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-transparent text-sm text-base-light focus:outline-none cursor-pointer w-full"
          >
            <option value="" className="bg-base-dark text-base-light">
              {isAr ? "جميع المدفوعات" : "All Payments"}
            </option>
            <option value="pending" className="bg-base-dark text-base-light">
              {isAr ? "قيد الانتظار" : "Pending"}
            </option>
            <option value="paid" className="bg-base-dark text-base-light">
              {isAr ? "مدفوع" : "Paid"}
            </option>
            <option value="failed" className="bg-base-dark text-base-light">
              {isAr ? "فشل" : "Failed"}
            </option>
            <option value="refunded" className="bg-base-dark text-base-light">
              {isAr ? "مرتجع" : "Refunded"}
            </option>
            <option
              value="cash_on_delivery"
              className="bg-base-dark text-base-light"
            >
              {isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilterBar;
