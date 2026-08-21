"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useListQuery, useConfig, useAuth } from "@payloadcms/ui";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import OrdersGrid from "./OrdersGrid";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import { CategorySpendChart } from "@/components/ui/Taps/DashboardTap/CategorySpendChart";

export default function OrdersListView() {
  const { isLoading } = useListQuery();
  const { config } = useConfig();
  const { user } = useAuth();

  const apiRoute = config.routes?.api || "/api";

  const [globalStats, setGlobalStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    totalPaidOnStripe: 0,
    totalPaidOnCash: 0,
    totalPaymentReceived: 0,
    ordersByStatus: {},
    ordersByPaymentMethod: {},
    loading: true,
  });

  const [orderActivity, setOrderActivity] = useState([]);
  const [categorySpendRaw, setCategorySpendRaw] = useState([]);

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        const res = await fetch(`${apiRoute}/order-stats`);

        if (!res.ok) {
          throw new Error("Failed to fetch order stats");
        }

        const data = await res.json();

        setGlobalStats({
          totalOrders: data.stats?.totalOrders || 0,
          newOrders: data.stats?.newOrders || 0,
          totalPaidOnStripe: data.stats?.totalPaidOnStripe || 0,
          totalPaidOnCash: data.stats?.totalPaidOnCash || 0,
          totalPaymentReceived: data.stats?.totalPaymentReceived || 0,
          ordersByStatus: {
            pending: data.stats?.ordersByStatus?.pending || 0,
            processing: data.stats?.ordersByStatus?.processing || 0,
            shipped: data.stats?.ordersByStatus?.shipped || 0,
            delivered: data.stats?.ordersByStatus?.delivered || 0,
            cancelled: data.stats?.ordersByStatus?.cancelled || 0,
          },
          ordersByPaymentMethod: {
            cash: data.stats?.ordersByPaymentMethod?.cash || 0,
            stripe: data.stats?.ordersByPaymentMethod?.stripe || 0,
          },
          loading: false,
        });

        setOrderActivity(data.activity || []);
        setCategorySpendRaw(data.categorySpend || []);
      } catch (error) {
        console.error("Order stats error:", error);
        setGlobalStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchGlobalStats();
  }, [apiRoute]);

  const categoryData = useMemo(() => {
    if (!Array.isArray(categorySpendRaw)) return [];

    return categorySpendRaw.map((cat) => ({
      name: cat.title,
      value: cat.value,
    }));
  }, [categorySpendRaw]);

  const orderStatsCards = useMemo(() => {
    return [
      {
        title: "Total Payments Received",
        titleAr: "إجمالي المدفوعات المستلمة",
        value: globalStats.loading ? "..." : globalStats.totalPaymentReceived,
        type: "money",
        suffix: "USD",
      },
      {
        title: "Total Paid via Stripe",
        titleAr: "المسدد عبر استرايب",
        value: globalStats.loading ? "..." : globalStats.totalPaidOnStripe,
        type: "money",
        suffix: "USD",
      },
      {
        title: "Total Paid Cash",
        titleAr: "المسدد نقداً",
        value: globalStats.loading ? "..." : globalStats.totalPaidOnCash,
        type: "money",
        suffix: "USD",
      },
      {
        title: "Total Orders",
        titleAr: "إجمالي الطلبات",
        value: globalStats.loading ? "..." : globalStats.totalOrders,
      },
      {
        title: "Stripe Orders",
        titleAr: "طلبات استرايب",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByPaymentMethod?.stripe ?? 0),
      },
      {
        title: "Cash Orders",
        titleAr: "الطلبات النقدية",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByPaymentMethod?.cash ?? 0),
      },
      {
        title: "Pending Orders",
        titleAr: "طلبات قيد الانتظار",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByStatus?.pending ?? 0),
      },
      {
        title: "Processing Orders",
        titleAr: "طلبات قيد التجهيز",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByStatus?.processing ?? 0),
      },
      {
        title: "Shipped Orders",
        titleAr: "طلبات تم شحنها",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByStatus?.shipped ?? 0),
      },
      {
        title: "Delivered Orders",
        titleAr: "طلبات تم تسليمها",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByStatus?.delivered ?? 0),
      },
      {
        title: "Cancelled Orders",
        titleAr: "طلبات ملغاة",
        value: globalStats.loading
          ? "..."
          : (globalStats.ordersByStatus?.cancelled ?? 0),
      },
    ];
  }, [globalStats]);

  if (isLoading) {
    return (
      <ContentLayout
        locale="en"
        title="Orders Dashboard"
        subtitle="Track customer orders, monitor revenue channels, and oversee store sales activity."
        MyThing="Orders Overview"
      >
        <div className="flex items-center justify-center p-12 text-[#E8C6A7]">
          Loading Orders...
        </div>
      </ContentLayout>
    );
  }

  return (
    <div className="transition-all duration-300 ease-in-out">
      <ContentLayout
        locale="en"
        title="Orders Dashboard"
        subtitle="Track customer orders, monitor revenue channels, and oversee store sales activity from one place."
        MyThing="Orders Overview"
        adminRoute
        isdiff
        adminFirstName={user}
      >
        <div className="flex flex-col gap-4 max-w-full">
          <TrackOrderData
            locale="en"
            cards={orderStatsCards}
            order={true}
            custom={true}
          />

          <div className="mt-4">
            <ChartAreaInteractive
              lines={[
                {
                  dataKey: "orders",
                  label: "Orders",
                  color: "#965015",
                  fill: "url(#fillOrders)",
                  stroke: "#965015",
                  strokeWidth: 2,
                },
                {
                  dataKey: "Revenue",
                  label: "Revenue",
                  color: "#D8A46B",
                  fill: "url(#fillSpent)",
                  stroke: "#D8A46B",
                  strokeWidth: 2,
                },
              ]}
              chartData={orderActivity}
              title="Order Creation & Revenue Activity"
              description="Track daily order placement velocity and overall generated store revenue over time."
              NotFound="No order activity found yet."
            />
          </div>

          <CategorySpendChart data={categoryData} />

          <OrdersGrid />
        </div>
      </ContentLayout>
    </div>
  );
}
