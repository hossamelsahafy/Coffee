"use client";

import { useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";

export default function CategoriesGrid() {
  const { data, isLoading, handleWhereChange } = useListQuery();
  const { config } = useConfig();

  const adminRoute = config.routes?.admin || "/admin";

  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);

    handleWhereChange(
      value.trim()
        ? {
            title: {
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
        CollectionName={"Categories"}
        search={search}
        searchBy={"Search By Title ..."}
        slug={"categories"}
      />

      {docs.length === 0 ? (
        <div className="py-12 text-center text-[#8C7A6B]">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {docs.map((category) => {
            const image =
              category.ImageSource === "Url"
                ? category.ImageUrl
                : typeof category.image === "object"
                  ? category.image?.url
                  : "";

            return (
              <Link
                key={category.id}
                href={`${adminRoute}/collections/categories/${category.id}`}
                className="group overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl text-center no-underline"
              >
                {/* Image Container */}
                <div className="aspect-square w-full overflow-hidden bg-[#241812]">
                  {image ? (
                    <img
                      src={image}
                      alt={category.title || "Category Image"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#8B7768]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="border-t border-[#3A2A22] bg-[#1A120D] p-3">
                  <p
                    className="truncate text-sm font-medium text-center text-[#E8D8C3]"
                    title={category.title}
                  >
                    {category.title || "Untitled"}
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
