"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useConfig, useAuth } from "@payloadcms/ui";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import FavoritesGrid from "./FavoritesGrid";

const FavoritesList = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const apiRoute = config.routes?.api || "/api";

  const [favoritesStats, setFavoritesStats] = useState({
    totalFavorites: 0,
    uniqueProductsFavorited: 0,
    loading: true,
  });

  const [favoritesActivity, setFavoritesActivity] = useState([]);

  useEffect(() => {
    async function fetchFavoritesStats() {
      try {
        const res = await fetch(`${apiRoute}/favorites-stats`);
        if (!res.ok) throw new Error("Failed to fetch favorites stats");

        const data = await res.json();

        setFavoritesStats({
          totalFavorites: data.stats?.totalFavorites || 0,
          uniqueProductsFavorited: data.stats?.uniqueProductsFavorited || 0,
          loading: false,
        });

        setFavoritesActivity(data.activity || []);
      } catch (error) {
        console.error("Favorites stats error:", error);
        setFavoritesStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchFavoritesStats();
  }, [apiRoute]);

  const favoriteStatsCards = useMemo(() => {
    return [
      {
        title: "Total Favorites",
        titleAr: "إجمالي المفضلة",
        value: favoritesStats.loading ? "..." : favoritesStats.totalFavorites,
      },
      {
        title: "Favorited Products",
        titleAr: "المنتجات المضافة للمفضلة",
        value: favoritesStats.loading
          ? "..."
          : favoritesStats.uniqueProductsFavorited,
      },
    ];
  }, [favoritesStats]);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <ContentLayout
        locale="en"
        title="Product Favorites Dashboard"
        subtitle="Monitor product favoriting trends, activity over time, and customer interest."
        MyThing="Product Favorites Overview"
        adminRoute
        isdiff
        adminFirstName={user}
      >
        <div className="flex flex-col gap-4 max-w-full">
          <TrackOrderData locale="en" cards={favoriteStatsCards} order={true} />

          <div className="mt-4">
            <ChartAreaInteractive
              lines={[
                {
                  dataKey: "favorites",
                  label: "Favorites",
                  color: "#965015",
                  fill: "url(#fillOrders)",
                  stroke: "#965015",
                  strokeWidth: 2,
                },
              ]}
              chartData={favoritesActivity}
              title="Product Favorites Activity"
              description="Track product favoriting trends over time."
              NotFound="No product favorite activity recorded yet."
            />
          </div>

          <FavoritesGrid />
        </div>
      </ContentLayout>
    </div>
  );
};

export default FavoritesList;
