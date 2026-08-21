"use client";

import React, { useState } from "react";

export const OrdersFilteringAndSorting = ({
  handleSortChange,
  handleWhereChange,
}) => {
  const [selectedSort, setSelectedSort] = useState("-createdAt");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const applyWhereClause = (orderStatus, paymentStatus, query) => {
    const conditions = [];

    if (orderStatus !== "all") {
      conditions.push({
        status: {
          equals: orderStatus,
        },
      });
    }

    if (paymentStatus !== "all") {
      conditions.push({
        "payment.status": {
          equals: paymentStatus,
        },
      });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery !== "") {
      conditions.push({
        orderNumber: {
          like: trimmedQuery,
        },
      });
    }

    if (conditions.length === 0) {
      handleWhereChange({});
    } else if (conditions.length === 1) {
      handleWhereChange(conditions[0]);
    } else {
      handleWhereChange({
        and: conditions,
      });
    }
  };

  const onSortSelect = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    handleSortChange(value);
  };

  const onOrderStatusSelect = (e) => {
    const value = e.target.value;
    setSelectedOrderStatus(value);
    applyWhereClause(value, selectedPaymentStatus, searchQuery);
  };

  const onPaymentStatusSelect = (e) => {
    const value = e.target.value;
    setSelectedPaymentStatus(value);
    applyWhereClause(selectedOrderStatus, value, searchQuery);
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    applyWhereClause(selectedOrderStatus, selectedPaymentStatus, value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    applyWhereClause(selectedOrderStatus, selectedPaymentStatus, "");
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row items-end justify-between gap-4 rounded-2xl border border-white/10! bg-white/5! p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-1 w-full md:flex-1 min-w-[200px]">
        <label className="text-xs text-[#E8C6A7]/70!">Search Order #</label>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by order number (e.g. ORD-171000...)"
            className="w-full rounded-xl border border-white/10! bg-[#2c1d15]! px-3 py-2 pr-8 text-sm text-[#fff9f0]! placeholder-[#E8C6A7]/40! focus:border-[#C07A3B]! focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 text-xs text-[#E8C6A7]/60! hover:text-white!"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls Group (Status Filters + Sort Dropdown in one row) */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto shrink-0">
        {/* Order Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#E8C6A7]/70!">Order Status</label>
          <select
            value={selectedOrderStatus}
            onChange={onOrderStatusSelect}
            className="rounded-xl border border-white/10! bg-[#2c1d15]! px-3 py-2 text-sm text-[#fff9f0]! focus:border-[#C07A3B]! focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#E8C6A7]/70!">Payment Status</label>
          <select
            value={selectedPaymentStatus}
            onChange={onPaymentStatusSelect}
            className="rounded-xl border border-white/10! bg-[#2c1d15]! px-3 py-2 text-sm text-[#fff9f0]! focus:border-[#C07A3B]! focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#E8C6A7]/70!">Sort By</label>
          <select
            value={selectedSort}
            onChange={onSortSelect}
            className="rounded-xl border border-white/10! bg-[#2c1d15]! px-3 py-2 text-sm text-[#fff9f0]! focus:border-[#C07A3B]! focus:outline-none"
          >
            <option value="-createdAt">Newest to Oldest</option>
            <option value="createdAt">Oldest to Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilteringAndSorting;
