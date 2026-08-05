"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";
export default function BlogsGrid() {
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
    <>
      <div className="p-6">
        <Header
          handleResetSearch={handleResetSearch}
          handleSearch={handleSearch}
          adminRoute={adminRoute}
          CollectionName={"Blogs"}
          search={search}
          searchBy={"Search By Title ..."}
          slug={"blogs"}
        />

        {docs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No Blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {docs.map((blog) => {
              const image =
                blog.ImageSource === "Url"
                  ? blog.ImageUrl
                  : typeof blog.image === "object"
                    ? blog.image?.url
                    : "";

              return (
                <Link
                  key={blog.id}
                  href={`${adminRoute}/collections/blogs/${blog.id}`}
                  className="group flex flex-col justify-between items-center overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] text-center no-underline transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl"
                >
                  <div className="">
                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#241812]">
                      {image ? (
                        <img
                          src={image}
                          alt={blog.title || "Blog Image"}
                          className="max-w-50 object-contain items-center transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#8B7768]">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p
                        className="text-sm font-semibold text-[#E8D8C3]"
                        title={blog.title}
                      >
                        {blog.title || "Untitled"}
                      </p>

                      {blog.subtitle && (
                        <p className="mt-2 text-sm text-[#A7897B]">
                          {blog.subtitle}
                        </p>
                      )}
                      {blog.des && (
                        <p className="mt-2 text-sm line-clamp-3 text-[#A7897B]">
                          {blog.des}
                        </p>
                      )}
                    </div>
                  </div>
                  {blog.clientName && (
                    <div className="border-t w-full border-[#3A2A22] bg-[#241812] px-3 py-2 text-center">
                      <div className="flex justify-between w-full items-center">
                        <p
                          className="truncate text-xs font-medium text-[#8C7A6B]"
                          title={blog.clientName}
                        >
                          Client:{" "}
                          <span className="text-[#E8D8C3]">
                            {blog.clientName}
                          </span>
                        </p>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const isFilled = index < (Number(blog.rate) || 0);

                            return (
                              <img
                                key={index}
                                src={
                                  isFilled
                                    ? "/assets/icons8starfilled301.png"
                                    : "/assets/icons8star49.png"
                                }
                                alt={isFilled ? "Filled Star" : "Empty Star"}
                                className="w-4 h-4 object-contain"
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
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
}
