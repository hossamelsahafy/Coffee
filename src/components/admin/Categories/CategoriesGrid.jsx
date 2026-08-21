"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";
import { CategoriesSkelaton } from "@/components/shared/Categories/CategoriesSkelaton";

export default function CategoriesGrid() {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInHomeFilter, setShowInHomeFilter] = useState("all"); // "all" | "true" | "false"

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 10;

  const fetchCategories = async (
    targetPage = 1,
    searchValue = "",
    homeFilter = "all",
  ) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        limit: String(limit),
        page: String(targetPage),
        depth: "1",
        sort: "-createdAt",
      });

      if (searchValue.trim()) {
        params.set("where[title][contains]", searchValue.trim());
      }

      if (homeFilter !== "all") {
        params.set("where[showInHomePage][equals]", homeFilter);
      }

      const res = await fetch(`/api/categories?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      setDocs(data.docs || []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setHasPrevPage(data.hasPrevPage || false);
      setHasNextPage(data.hasNextPage || false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1, "", "all");
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    fetchCategories(1, value, showInHomeFilter);
  };

  const handleResetSearch = () => {
    setSearch("");
    setShowInHomeFilter("all");
    fetchCategories(1, "", "all");
  };

  const handleFilterClick = (value) => {
    setShowInHomeFilter(value);
    fetchCategories(1, search, value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCategories(newPage, search, showInHomeFilter);
    }
  };

  return (
    <div className="p-6 text-[#E8D8C3]">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName="Categories"
        search={search}
        searchBy="Search By Title ..."
        slug="categories"
      />

      {/* Filter pills moved directly below/integrated cleanly without white borders */}
      <div className="mb-4 flex flex-wrap items-center gap-3 px-1">
        <span className="text-xs font-semibold tracking-wider text-[#9E8A78]">
          HOME FILTER:
        </span>
        <button
          type="button"
          onClick={() => handleFilterClick("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer outline-none border-0 ${
            showInHomeFilter === "all"
              ? "bg-[#c89553] text-[#120c07] shadow"
              : "bg-[#1A120D] text-[#E8D8C3] hover:bg-[#271d18]"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleFilterClick("true")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer outline-none border-0 ${
            showInHomeFilter === "true"
              ? "bg-[#c89553] text-[#120c07] shadow"
              : "bg-[#1A120D] text-[#E8D8C3] hover:bg-[#271d18]"
          }`}
        >
          Shown In Home Page
        </button>
        <button
          type="button"
          onClick={() => handleFilterClick("false")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer outline-none border-0 ${
            showInHomeFilter === "false"
              ? "bg-[#c89553] text-[#120c07] shadow"
              : "bg-[#1A120D] text-[#E8D8C3] hover:bg-[#271d18]"
          }`}
        >
          Hidden from Home Page
        </button>
      </div>

      <div className="p-4 bg-[#1A120D] border border-[#3A2A22] rounded-2xl shadow-xl">
        {isLoading ? (
          <CategoriesSkelaton />
        ) : docs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No categories found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {docs.map((category) => {
                const image =
                  category.ImageSource === "Url"
                    ? category.ImageUrl
                    : category.uploadImage?.url;

                return (
                  <Link
                    key={category.id}
                    href={`${adminRoute}/collections/categories/${category.id}`}
                    className="group overflow-hidden rounded-xl border border-[#3A2A22] bg-[#120c0a] transition-all duration-300 hover:border-[#c89553] hover:shadow-xl text-center no-underline flex flex-col justify-between relative"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                          category.showInHomePage
                            ? "bg-[#c89553] text-[#120c07]"
                            : "bg-[#271d18] text-[#9E8A78]"
                        }`}
                      >
                        {category.showInHomePage ? "Home: On" : "Home: Off"}
                      </span>
                    </div>

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
          </>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
