"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";

export default function ShippingZonesGrid() {
  const { data, isLoading, handleWhereChange, handlePageChange } =
    useListQuery();
  const { config } = useConfig();

  const adminRoute = config.routes?.admin || "/admin";

  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);

    handleWhereChange(
      value.trim()
        ? {
            cityName: {
              contains: value,
            },
          }
        : {},
    );
  };

  const handleResetSearch = () => {
    setSearch("");
    handleWhereChange({});
  };

  if (isLoading) {
    return <div className="p-6 text-[#E8D8C3]">Loading...</div>;
  }

  const docs = data?.docs || [];
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 1;
  const hasPrevPage = data?.hasPrevPage || false;
  const hasNextPage = data?.hasNextPage || false;

  const onPageChange = (newPage) => {
    if (typeof handlePageChange === "function") {
      handlePageChange(newPage);
    }
  };

  return (
    <div className="p-6">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName={"Shipping Zones"}
        search={search}
        searchBy={"Search By City Name ..."}
        slug={"shipping-zones"}
      />

      {docs.length === 0 ? (
        <div className="py-12 text-center text-[#8C7A6B]">
          No Shipping Zones found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {docs.map((data) => {
            const editUrl = `${adminRoute}/collections/shipping-zones/${data.id}`;

            return (
              <div
                key={data.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/50 hover:bg-white/10 hover:shadow-xl hover:shadow-[#6F3F1C]/20"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C07A3B]/10 blur-2xl transition-all duration-300 group-hover:bg-[#C07A3B]/20" />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#D8A46B]">
                        {data.cityName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-base text-gray-300">
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-gray-400">Shipping Price:</span>
                      <span className="font-semibold text-[#E8C6A7]">
                        ${data.shippingPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                  <Link
                    href={editUrl}
                    className="inline-flex items-center justify-center rounded-xl border border-[#C07A3B]/30 bg-[#6F3F1C]/40 px-4 py-2 text-sm font-medium text-[#E8C6A7] shadow-sm transition-all hover:bg-[#C07A3B] hover:text-white"
                  >
                    Edit Zone
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
