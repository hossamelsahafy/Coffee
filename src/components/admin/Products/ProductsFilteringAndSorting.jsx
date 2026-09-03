"use client";

import React, { useState } from "react";
import Link from "next/link";

const ProductsFilteringAndSorting = ({
  handleSortChange,
  handleWhereChange,
  categories = [],
  adminRoute,
  brands = [],
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
  console.log(brands);
  console.log(categories);

  const updatePayloadWhere = ({
    search = searchTerm,
    category = selectedCategory,
    brand = brandSearch,
    booleans = booleanFilters,
  } = {}) => {
    if (typeof handleWhereChange !== "function") return;

    const conditions = [];
    const term = search.trim();

    // 1. Search Query
    if (term) {
      conditions.push({
        or: [
          { title: { contains: term } },
          { titleAr: { contains: term } },
          { subtitle: { contains: term } },
          { slug: { contains: term } },
        ],
      });
    }

    if (category && category !== "all") {
      conditions.push({
        category: { equals: category },
      });
    }

    if (brand) {
      conditions.push({
        BrandName: { equals: brand },
      });
    }

    Object.entries(booleans).forEach(([key, value]) => {
      if (value) {
        conditions.push({
          [key]: { equals: true },
        });
      }
    });

    const newWhere = conditions.length > 0 ? { and: conditions } : {};

    handleWhereChange(newWhere);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    updatePayloadWhere({
      search: value,
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setSelectedCategory(value);

    updatePayloadWhere({
      category: value,
    });
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;

    setBrandSearch(value);

    updatePayloadWhere({
      brand: value,
    });
  };

  const handleCheckboxChange = (key) => {
    const updatedBooleans = {
      ...booleanFilters,
      [key]: !booleanFilters[key],
    };

    setBooleanFilters(updatedBooleans);

    updatePayloadWhere({
      booleans: updatedBooleans,
    });
  };

  const handleSortSelect = (e) => {
    const value = e.target.value;

    setPriceSort(value);

    if (typeof handleSortChange !== "function") return;

    switch (value) {
      case "titleAsc":
        handleSortChange("title");
        break;

      case "titleDesc":
        handleSortChange("-title");
        break;

      case "newest":
        handleSortChange("-createdAt");
        break;

      default:
        handleSortChange("");
        break;
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

          <select
            value={brandSearch}
            onChange={handleBrandChange}
            className="w-full px-3 py-2 bg-[#1f140e] border border-[#6b4a37] rounded-md text-sm text-[#fff9f0] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            <option value="">All Brands</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
                {brand.nameAr ? ` / ${brand.nameAr}` : ""}
              </option>
            ))}
          </select>

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
            {
              key: "ShowInDiscountSection",
              label: "Discounted",
            },
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
