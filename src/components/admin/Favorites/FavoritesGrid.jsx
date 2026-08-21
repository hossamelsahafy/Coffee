"use client";

import React, { useState, useEffect } from "react";
import { useConfig } from "@payloadcms/ui";
import Pagination from "@/components/shared/AdminUI/Pagination";
import ProductsGrid from "@/components/shared/AdminUI/ProductsGrid";

export const FavoritesGrid = () => {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";
  const apiRoute = config.routes?.api || "/api";

  const [page, setPage] = useState(1);
  const [gridState, setGridState] = useState({
    docs: [],
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    loading: true,
  });

  useEffect(() => {
    async function fetchGridData() {
      setGridState((prev) => ({ ...prev, loading: true }));
      try {
        const res = await fetch(
          `${apiRoute}/favorites-stats?page=${page}&limit=12`,
        );
        if (!res.ok) throw new Error("Failed to fetch favorites catalog");

        const data = await res.json();

        setGridState({
          docs: data.docs || [],
          totalPages: data.totalPages || 1,
          hasPrevPage: data.hasPrevPage || false,
          hasNextPage: data.hasNextPage || false,
          loading: false,
        });
      } catch (error) {
        console.error("Error loading grid favorites:", error);
        setGridState((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchGridData();
  }, [apiRoute, page]);

  const getFavoriteBadge = (count = 1) => (
    <span className="rounded-full border border-[#C07A3B]/30! bg-[#C07A3B]/20! px-2.5 py-1 text-[11px] font-semibold text-[#E8C6A7]!">
      {count} {count === 1 ? "Favorite" : "Favorites"}
    </span>
  );

  return (
    <>
      <div className="flex p-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fff9f0]">
            Product Favorites Catalog
          </h1>
          <p className="text-sm text-[#e2cca6]/70">
            Monitor customer wishlists and saved product items analytics
          </p>
        </div>
      </div>

      <div className="p-4 mb-4 font-sans min-h-screen text-[#fff9f0]!">
        {gridState.loading ? (
          <div className="flex justify-center items-center h-48 text-[#e2cca6]/60!">
            Fetching product favorites...
          </div>
        ) : gridState.docs.length === 0 ? (
          <div className="p-12 text-center text-[#e2cca6]/60 bg-[#2c1d15]! border border-[#6b4a37]/50! rounded-xl">
            No favorite records found.
          </div>
        ) : (
          <ProductsGrid
            gridState={gridState}
            getViewCountBadge={getFavoriteBadge}
            adminRoute={adminRoute}
          />
        )}
      </div>

      {gridState.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={gridState.totalPages}
          hasPrevPage={gridState.hasPrevPage}
          hasNextPage={gridState.hasNextPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </>
  );
};

export default FavoritesGrid;
