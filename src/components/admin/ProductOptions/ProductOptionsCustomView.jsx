"use client";

import React, { useMemo, useRef, useState } from "react";
import { Gutter, useListQuery } from "@payloadcms/ui";
import Link from "next/link";

export default function ProductOptionsCustomView() {
  const {
    data,
    isLoading,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    handleWhereChange,
    handlePageChange,
  } = useListQuery();

  const docs = data?.docs || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const searchTimeout = useRef(null);

  const buildWhere = (search, type) => {
    const conditions = [];

    const cleanSearch = search.trim();

    if (cleanSearch) {
      conditions.push({
        or: [
          {
            name: {
              like: cleanSearch,
            },
          },
          {
            nameAr: {
              like: cleanSearch,
            },
          },
        ],
      });
    }

    if (type !== "all") {
      conditions.push({
        type: {
          equals: type,
        },
      });
    }

    if (conditions.length === 0) {
      return {};
    }

    return {
      and: conditions,
    };
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const where = buildWhere(value, selectedType);

      handleWhereChange(where);
    }, 400);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);

    const where = buildWhere(searchTerm, type);

    handleWhereChange(where);
  };

  const groupedOptions = useMemo(() => {
    return docs.reduce((acc, option) => {
      const type = option.type || "other";

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push(option);

      return acc;
    }, {});
  }, [docs]);

  const optionTypes = [
    { value: "all", label: "All Types" },
    { value: "color", label: "Color" },
    { value: "quantity", label: "Quantity" },
    { value: "type", label: "Type" },
    { value: "size", label: "Size" },
  ];

  return (
    <Gutter className="p-6 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-gradient-to-r from-[#2c1d15] to-[#42281c] p-6 rounded-2xl border border-[#6b4a37]/50 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fff9f0]">
            Product Options Manager
          </h1>

          <p className="text-sm text-[#e2cca6]/70 mt-1">
            Organize colors, sizes, types, and quantities for your catalog
            variants.
          </p>
        </div>

        <Link
          href="/admin/collections/product-options/create"
          className="inline-flex items-center justify-center rounded-xl bg-[#C07A3B] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#d88c45] hover:shadow-lg"
        >
          + Create New Option
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="relative w-full lg:flex-1">
          <input
            type="text"
            placeholder="Search option name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-[#C07A3B] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
          {optionTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleTypeChange(type.value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${
                selectedType === type.value
                  ? "bg-[#C07A3B] text-white border-[#C07A3B] shadow-md shadow-[#C07A3B]/20"
                  : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-36 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="p-12 text-center text-[#e2cca6]/60 bg-white/5 border border-white/10 rounded-2xl">
          No product options found matching your filter.
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {Object.entries(groupedOptions).map(([type, options]) => (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#C07A3B]/20 text-[#D8A46B] border border-[#C07A3B]/30">
                    {type}
                  </span>

                  <span className="text-xs text-gray-400">
                    {options.length} {options.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {options.map((option) => (
                    <Link
                      key={option.id}
                      href={`/admin/collections/product-options/${option.id}`}
                      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/60 hover:bg-white/10 hover:shadow-xl hover:shadow-[#6F3F1C]/20"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#D8A46B] transition-colors">
                          {option.name}
                        </h3>

                        {option.nameAr && (
                          <p
                            className="text-sm text-[#E8C6A7]/70 mt-1"
                            dir="rtl"
                          >
                            {option.nameAr}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-gray-400">
                        <span>ID: {option.id.slice(-6)}</span>

                        <span className="text-[#D8A46B] font-medium group-hover:underline">
                          Edit &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={!hasPrevPage}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-white/10 bg-white/5 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                &larr; Previous
              </button>

              <span className="text-sm text-[#e2cca6]/80">
                Page <strong className="text-white">{page}</strong> of{" "}
                <strong className="text-white">{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={!hasNextPage}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-white/10 bg-white/5 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </Gutter>
  );
}
