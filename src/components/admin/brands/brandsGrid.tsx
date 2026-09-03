"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";

interface Brand {
  id: string;
  name: string;
  nameAr: string;
  createdAt: string;
}

export default function BrandsGrid() {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [docs, setDocs] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 10;

  const fetchBrands = async (
    targetPage: number = 1,
    searchValue: string = "",
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
        params.set("where[name][contains]", searchValue.trim());
      }

      const res = await fetch(`/api/brands?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await res.json();

      setDocs(data.docs || []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setHasPrevPage(data.hasPrevPage || false);
      setHasNextPage(data.hasNextPage || false);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(1, "");
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchBrands(1, value);
  };

  const handleResetSearch = () => {
    setSearch("");
    fetchBrands(1, "");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBrands(newPage, search);
    }
  };

  return (
    <div className="p-6 text-[#E8D8C3]">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName="Brands"
        search={search}
        searchBy="Search By Name ..."
        slug="brands"
      />

      <div className="p-4 bg-[#1A120D] border border-[#3A2A22] rounded-2xl shadow-xl mt-6">
        {isLoading ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            Loading brands...
          </div>
        ) : docs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No brands found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {docs.map((brand) => {
              const formattedDate = brand.createdAt
                ? new Date(brand.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "";

              return (
                <Link
                  key={brand.id}
                  href={`${adminRoute}/collections/brands/${brand.id}`}
                  className="group overflow-hidden rounded-xl border border-[#3A2A22] bg-[#120c0a] p-5 transition-all duration-300 hover:border-[#c89553] hover:shadow-xl flex flex-col justify-between no-underline min-h-[140px]"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-[#E8D8C3] group-hover:text-[#c89553] transition-colors">
                      {brand.name || "Untitled"}
                    </h3>
                    <span className="text-sm text-[#9E8A78]" dir="rtl">
                      {brand.nameAr}
                    </span>
                  </div>

                  {formattedDate && (
                    <div className="pt-4 mt-4 border-t border-[#3A2A22] text-xs text-[#8C7A6B]">
                      <span>Created: {formattedDate}</span>
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
