"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";

export default function NotesGrid() {
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
          CollectionName={"Notes"}
          search={search}
          searchBy={"Search By Title ..."}
          slug={"Notes"}
        />

        {docs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No Notes found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {docs.map((note) => {
              const image =
                note.ImageSource === "Url"
                  ? note.ImageUrl
                  : typeof note.image === "object"
                    ? note.image?.url
                    : "";

              return (
                <Link
                  key={note.id}
                  href={`${adminRoute}/collections/Notes/${note.id}`}
                  className="group flex flex-col justify-between items-center overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] text-center no-underline transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl"
                >
                  <div className="">
                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#241812]">
                      {image ? (
                        <img
                          src={image}
                          alt={note.title || "Blog Image"}
                          className="w-full h-full object-cover items-center transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#8B7768]">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-semibold text-[#E8D8C3]!">
                        {note.title || "Untitled"}
                      </p>

                      {note.des && <p className="mt-2 text-sm ">{note.des}</p>}
                    </div>
                    <div className="flex p-2 text-sm w-full justify-between items-center">
                      <p>BrandName </p>
                      <p>{note.brandName}</p>
                    </div>
                  </div>
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
