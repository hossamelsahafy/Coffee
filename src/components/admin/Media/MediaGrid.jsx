"use client";

import { useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
export default function MediaGrid() {
  const { data, isLoading, handleWhereChange } = useListQuery();
  const { config } = useConfig();

  const adminRoute = config.routes?.admin || "/admin";
  if (isLoading) return <div className="p-6 text-[#E8D8C3]">Loading...</div>;
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);

    handleWhereChange(
      value.trim()
        ? {
            filename: {
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

  if (isLoading) return <div>Loading...</div>;

  const docs = data?.docs || [];

  return (
    <div className="p-6">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName={"Media"}
        search={search}
        searchBy={"Search By FileName ..."}
        slug={"media"}
      />

      {docs.length === 0 ? (
        <div className="py-12 text-center text-[#8C7A6B]">No media found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {docs.map((media) => {
            const image =
              typeof media.url === "string"
                ? media.url
                : media.thumbnailURL || "";

            return (
              <Link
                key={media.id}
                href={`${adminRoute}/collections/media/${media.id}`}
                className="group overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden bg-[#241812]">
                  <img
                    src={image}
                    alt={media.filename}
                    className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="border-t border-[#3A2A22] bg-[#1A120D] p-3">
                  <p
                    className="truncate text-sm font-medium text-[#E8D8C3]"
                    title={media.filename}
                  >
                    {media.filename}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
