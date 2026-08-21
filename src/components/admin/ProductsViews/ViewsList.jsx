"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useConfig, useAuth } from "@payloadcms/ui";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import ViewsGrid from "./ViewsGrid";

const ViewsList = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const apiRoute = config.routes?.api || "/api";

  const [viewsStats, setViewsStats] = useState({
    totalViews: 0,
    uniqueProductsViewed: 0,
    loading: true,
  });

  const [viewsActivity, setViewsActivity] = useState([]);

  useEffect(() => {
    async function fetchViewsStats() {
      try {
        const res = await fetch(`${apiRoute}/product-views-stats?limit=1`);
        if (!res.ok) throw new Error("Failed to fetch product views stats");

        const data = await res.json();

        setViewsStats({
          totalViews: data.stats?.totalViews || 0,
          uniqueProductsViewed: data.stats?.uniqueProductsViewed || 0,
          loading: false,
        });

        setViewsActivity(data.activity || []);
      } catch (error) {
        console.error("Product views stats error:", error);
        setViewsStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchViewsStats();
  }, [apiRoute]);

  const viewStatsCards = useMemo(() => {
    return [
      {
        title: "Total Views",
        titleAr: "إجمالي المشاهدات",
        value: viewsStats.loading ? "..." : viewsStats.totalViews,
      },
      {
        title: "Products Tracked",
        titleAr: "المنتجات المشاهدة",
        value: viewsStats.loading ? "..." : viewsStats.uniqueProductsViewed,
      },
    ];
  }, [viewsStats]);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <ContentLayout
        locale="en"
        title="Product Views Dashboard"
        subtitle="Monitor product viewing traffic, activity trends, and customer interaction over time."
        MyThing="Product Views Overview"
        adminRoute
        isdiff
        adminFirstName={user}
      >
        <div className="flex flex-col gap-4 max-w-full">
          <TrackOrderData locale="en" cards={viewStatsCards} order={true} />

          <div className="mt-4">
            <ChartAreaInteractive
              lines={[
                {
                  dataKey: "views",
                  label: "Views",
                  color: "#965015",
                  fill: "url(#fillOrders)",
                  stroke: "#965015",
                  strokeWidth: 2,
                },
              ]}
              chartData={viewsActivity}
              title="Product View Activity"
              description="Track product viewing trends over time."
              NotFound="No product view activity recorded yet."
            />
          </div>

          <ViewsGrid />
        </div>
      </ContentLayout>
    </div>
  );
};

export default ViewsList;
