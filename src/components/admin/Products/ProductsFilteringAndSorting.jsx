"use client";

import React, { useState } from "react";
import Link from "next/link";

const ProductsFilteringAndSorting = ({
  handleSortChange,
  handleWhereChange,
  categories = [],
  adminRoute,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [brandSearch, setBrandSearch] = useState("");
  const [priceSort, setPriceSort] = useState("none");
  const [booleanFilters, setBooleanFilters] = useState({
    isNewest: false,
    ShowInDiscountSection: false,
    important: false,
    isBestSeller: false,
  });

  const updatePayloadWhere = (
    search = searchTerm,
    category = selectedCategory,
    brand = brandSearch,
    booleans = booleanFilters,
  ) => {
    if (typeof handleWhereChange !== "function") return;

    const AND = [];

    if (search.trim()) {
      const term = search.trim();

      AND.push({
        or: [
          { id: { equals: term } },
          { title: { contains: term } },
          { titleAr: { contains: term } },
          { subtitle: { contains: term } },
          { slug: { contains: term } },
        ],
      });
    }

    if (category !== "all") {
      AND.push({
        category: {
          equals: category,
        },
      });
    }

    if (brand.trim()) {
      AND.push({
        subtitle: {
          contains: brand.trim(),
        },
      });
    }

    Object.entries(booleans).forEach(([key, value]) => {
      if (value) {
        AND.push({
          [key]: {
            equals: true,
          },
        });
      }
    });

    handleWhereChange(AND.length ? { AND } : {});
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    updatePayloadWhere(val, selectedCategory, brandSearch, booleanFilters);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    updatePayloadWhere(searchTerm, val, brandSearch, booleanFilters);
  };

  const handleBrandChange = (e) => {
    const val = e.target.value;
    setBrandSearch(val);
    updatePayloadWhere(searchTerm, selectedCategory, val, booleanFilters);
  };

  const handleCheckboxChange = (key) => {
    const updatedBooleans = { ...booleanFilters, [key]: !booleanFilters[key] };
    setBooleanFilters(updatedBooleans);
    updatePayloadWhere(
      searchTerm,
      selectedCategory,
      brandSearch,
      updatedBooleans,
    );
  };

  const handleSortSelect = (e) => {
    const value = e.target.value;
    setPriceSort(value);

    if (typeof handleSortChange === "function") {
      if (value === "titleAsc") {
        handleSortChange("title");
      } else if (value === "titleDesc") {
        handleSortChange("-title");
      } else if (value === "newest") {
        handleSortChange("-createdAt");
      } else {
        handleSortChange("");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fff9f0]">
            Roastery & Products Dashboard
          </h1>
          <p className="text-sm text-[#e2cca6]/70">
            Manage, search, and filter coffee inventory globally
          </p>
        </div>
        <Link
          href={`${adminRoute}/collections/products/create`}
          className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#a36a46] text-[#fff9f0] font-medium rounded-lg shadow transition-colors text-sm border border-[#6b4a37]"
        >
          + Add New Product
        </Link>
      </div>

      <div className="p-5 bg-[#2c1d15] border border-[#6b4a37]/50 rounded-xl mb-8 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search title, slug..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 bg-[#1f140e] border border-[#6b4a37] rounded-md text-sm text-[#fff9f0] placeholder-[#e2cca6]/40 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          />

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 bg-[#1f140e] border border-[#6b4a37] rounded-md text-sm text-[#fff9f0] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by Brand (Subtitle)..."
            value={brandSearch}
            onChange={handleBrandChange}
            className="w-full px-3 py-2 bg-[#1f140e] border border-[#6b4a37] rounded-md text-sm text-[#fff9f0] placeholder-[#e2cca6]/40 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          />

          <select
            value={priceSort}
            onChange={handleSortSelect}
            className="w-full px-3 py-2 bg-[#1f140e] border border-[#6b4a37] rounded-md text-sm text-[#fff9f0] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            <option value="none">Sort: Default</option>
            <option value="titleAsc">Title: A-Z</option>
            <option value="titleDesc">Title: Z-A</option>
            <option value="newest">Recently Created</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#6b4a37]/40">
          <span className="text-xs font-semibold text-[#d4a373] uppercase tracking-wider">
            Filter Badges:
          </span>
          {[
            { key: "isBestSeller", label: "Best Seller" },
            { key: "isNewest", label: "New Arrival" },
            { key: "important", label: "Important" },
            { key: "ShowInDiscountSection", label: "Discounted" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-[#e2cca6] cursor-pointer select-none hover:text-[#fff9f0]"
            >
              <input
                type="checkbox"
                checked={booleanFilters[key]}
                onChange={() => handleCheckboxChange(key)}
                className="w-4 h-4 rounded bg-[#1f140e] border-[#6b4a37] text-[#8c5a3c] focus:ring-[#d4a373]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsFilteringAndSorting;
