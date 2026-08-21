"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useListQuery, useConfig, useAuth } from "@payloadcms/ui";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import ProductsGrid from "./ProductsGrid";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import MostOrderedProducts from "./MostOrderedProducts";

export default function ProductsListView() {
  const { isLoading } = useListQuery();
  const { config } = useConfig();
  const { user } = useAuth();

  const apiRoute = config.routes?.api || "/api";

  const [globalStats, setGlobalStats] = useState({
    totalProducts: 0,
    newProducts: 0,
    featuredProducts: 0,
    discountedProducts: 0,
    loading: true,
  });

  const [productActivity, setProductActivity] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);

  useEffect(() => {
    async function fetchGlobalStats() {
      try {
        const res = await fetch(`${apiRoute}/products-stats`);

        if (!res.ok) {
          throw new Error("Failed to fetch product stats");
        }

        const data = await res.json();

        setGlobalStats({
          totalProducts: data.stats?.totalProducts || 0,
          newProducts: data.stats?.newProducts || 0,
          featuredProducts: data.stats?.featuredProducts || 0,
          discountedProducts: data.stats?.discountedProducts || 0,
          loading: false,
        });

        setProductActivity(data.activity || []);
        setMostOrdered(data.mostOrderedProducts || []);
      } catch (error) {
        console.error("Product stats error:", error);
        setGlobalStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchGlobalStats();
  }, [apiRoute]);

  const productStatsCards = useMemo(() => {
    return [
      {
        title: "Total Products",
        titleAr: "إجمالي المنتجات",
        value: globalStats.loading ? "..." : globalStats.totalProducts,
        icon: "package",
        description: "All products active in catalog",
        descriptionAr: "جميع المنتجات المسجلة",
      },
      {
        title: "New Products",
        titleAr: "منتجات جديدة",
        value: globalStats.loading ? "..." : globalStats.newProducts,
        icon: "sparkles",
        description: "Products flagged as new arrivals",
        descriptionAr: "المنتجات المضافة حديثاً",
      },
      {
        title: "Featured Products",
        titleAr: "منتجات مميزة",
        value: globalStats.loading ? "..." : globalStats.featuredProducts,
        icon: "star",
        description: "Products highlighted as important",
        descriptionAr: "المنتجات المميزة في المتجر",
      },
      {
        title: "Discounted Products",
        titleAr: "منتجات المخفضة",
        value: globalStats.loading ? "..." : globalStats.discountedProducts,
        icon: "tag",
        description: "Products in discount section",
        descriptionAr: "المنتجات مع الخصومات",
      },
    ];
  }, [globalStats]);

  if (isLoading) {
    return (
      <ContentLayout
        locale="en"
        title="Products Dashboard"
        subtitle="Manage your catalog, monitor product growth, feature important products, and organize inventory from one place."
        MyThing="Products Overview"
      >
        <div className="flex items-center justify-center p-12 text-[#E8C6A7]">
          Loading products...
        </div>
      </ContentLayout>
    );
  }

  return (
    <div className="transition-all duration-300 ease-in-out">
      <ContentLayout
        locale="en"
        title="Products Dashboard"
        subtitle="Manage your catalog, monitor product growth, feature important products, and organize inventory from one place."
        MyThing="Products Overview"
        adminRoute
        isdiff
        adminFirstName={user}
      >
        <div className="flex flex-col gap-4 max-w-full">
          <TrackOrderData locale="en" cards={productStatsCards} order={true} />

          <div className="mt-4">
            <ChartAreaInteractive
              lines={[
                {
                  dataKey: "products",
                  label: "Products",
                  color: "#965015",
                  fill: "url(#fillOrders)",
                  stroke: "#965015",
                  strokeWidth: 2,
                },
              ]}
              chartData={productActivity}
              title="Product Creation Activity"
              description="Track how many products are added over time and monitor catalog growth."
              NotFound="No product activity found yet."
            />
          </div>

          <MostOrderedProducts data={mostOrdered} />

          <ProductsGrid />
        </div>
      </ContentLayout>
    </div>
  );
}
