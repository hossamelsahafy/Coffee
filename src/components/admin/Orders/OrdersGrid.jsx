"use client";

import React from "react";
import { useConfig, useListQuery } from "@payloadcms/ui";
import Link from "next/link";
import Pagination from "@/components/shared/AdminUI/Pagination";
import OrdersFilteringAndSorting from "./ordersFilteringAndSorting";

export const OrdersCustomGrid = () => {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const {
    data,
    isLoading,
    handlePageChange,
    handleSortChange,
    handleWhereChange,
  } = useListQuery({ limit: 12 });

  const orders = data?.docs || [];
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 1;
  const hasPrevPage = data?.hasPrevPage || false;
  const hasNextPage = data?.hasNextPage || false;

  const onPageChange = (newPage) => {
    if (typeof handlePageChange === "function") {
      handlePageChange(newPage);
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusMap = {
      pending: {
        bg: "bg-amber-500/20!",
        text: "text-amber-300!",
        border: "border-amber-500/30!",
      },
      processing: {
        bg: "bg-sky-500/20!",
        text: "text-sky-300!",
        border: "border-sky-500/30!",
      },
      shipped: {
        bg: "bg-purple-500/20!",
        text: "text-purple-300!",
        border: "border-purple-500/30!",
      },
      delivered: {
        bg: "bg-emerald-500/20!",
        text: "text-emerald-300!",
        border: "border-emerald-500/30!",
      },
      cancelled: {
        bg: "bg-rose-500/20!",
        text: "text-rose-300!",
        border: "border-rose-500/30!",
      },
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span
        className={`rounded-full border ${style.border} ${style.bg} px-2.5 py-1 text-[11px] font-semibold capitalize ${style.text}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    return (
      <span className="rounded-full border border-white/10! bg-white/5! px-2.5 py-1 text-[11px] font-medium text-[#E8C6A7]! capitalize">
        {status?.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <>
      <div className="flex p-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fff9f0]">
            Orders Management Dashboard
          </h1>
          <p className="text-sm text-[#e2cca6]/70">
            Manage, search, and filter Orders
          </p>
        </div>
        <Link
          href={`${adminRoute}/collections/orders/create`}
          className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#a36a46] text-[#fff9f0] font-medium rounded-lg shadow transition-colors text-sm border border-[#6b4a37]"
        >
          + Add New Order
        </Link>
      </div>
      <div className="p-4 mb-4 font-sans min-h-screen text-[#fff9f0]!">
        <OrdersFilteringAndSorting
          handleSortChange={handleSortChange}
          handleWhereChange={handleWhereChange}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-48 text-[#e2cca6]/60!">
            Fetching orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#e2cca6]/60 bg-[#2c1d15]! border border-[#6b4a37]/50! rounded-xl">
            No orders found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => {
              const customerName = order.customer
                ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
                : "Guest / Unlinked";

              return (
                <div
                  key={order.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10! bg-white/5! p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/50! hover:bg-white/10! hover:shadow-xl hover:shadow-[#6F3F1C]/20!"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C07A3B]/10! blur-2xl transition-all duration-300 group-hover:bg-[#C07A3B]/20" />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs text-[#E8C6A7]/60! uppercase tracking-wider font-semibold">
                          Order ID
                        </span>
                        <h3 className="text-lg font-bold text-white! transition-colors group-hover:text-[#D8A46B]! truncate">
                          {order.orderNumber}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {getOrderStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-gray-300!">
                      <div className="flex items-center justify-between border-t border-white/5! pt-3">
                        <span className="text-gray-400!">Customer</span>
                        <span className="font-medium text-gray-200! truncate max-w-[150px]">
                          {customerName || "--"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5! pt-3">
                        <span className="text-gray-400!">Payment Method</span>
                        <span className="font-medium text-gray-200! uppercase text-xs">
                          {order.payment?.method || "--"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5! pt-3">
                        <span className="text-gray-400!">Payment Status</span>
                        {getPaymentStatusBadge(order.payment?.status)}
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center justify-between border-t border-white/5! pt-3">
                            <span className="text-gray-400!">
                              Items Ordered
                            </span>
                            <span className="font-medium text-[#D8A46B]!">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </span>
                          </div>

                          <div className="space-y-2 max-h-40 overflow-y-auto rounded-xl border border-white/5! bg-black/20! p-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-white/5! bg-white/5! px-3 py-2 text-xs"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="font-medium text-white! truncate">
                                    {item.title || "Product item"}
                                  </p>
                                  {item.optionValue && (
                                    <span className="text-[#E8C6A7]/60!">
                                      {item.optionType}: {item.optionValue}
                                    </span>
                                  )}
                                  <p className="text-gray-400!">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-[#D8A46B]!">
                                    ${item.total ?? 0}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/5! pt-3 font-semibold">
                        <span className="text-gray-400!">Total Amount</span>
                        <span className="text-base text-[#D8A46B]!">
                          ${order.total ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end border-t border-white/10! pt-4">
                    <Link
                      href={`${adminRoute}/collections/orders/${order.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-[#C07A3B]/30! bg-[#6F3F1C]/40! px-4 py-2 text-sm font-medium text-[#E8C6A7]! shadow-sm transition-all hover:bg-[#C07A3B]! hover:text-white!"
                    >
                      View / Edit Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
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

export default OrdersCustomGrid;
