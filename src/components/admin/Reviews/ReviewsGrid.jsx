"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import ReviewsSkelaton from "@/components/shared/Skelatons/ReviewsSkelaton";
export default function ReviewsGrid() {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [data, setData] = useState({
    docs: [],
    totalPages: 1,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(
    async (currentPage, currentSearch, currentApproval) => {
      setIsLoading(true);
      try {
        const whereConditions = {};

        const trimmedSearch = currentSearch.trim();
        if (trimmedSearch) {
          whereConditions.or = [
            { title: { contains: trimmedSearch } },
            { "ClientName.firstName": { contains: trimmedSearch } },
          ];
        }

        if (currentApproval === "approved") {
          whereConditions.isApproved = { equals: true };
        } else if (currentApproval === "unapproved") {
          whereConditions.isApproved = { equals: false };
        }

        const result = await GetDataWithPagination(
          "reviews",
          currentPage,
          9,
          "-createdAt",
          whereConditions,
          true,
          2,
        );

        setData(result);
      } catch (error) {
        console.error("Error fetching reviews grid data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchReviews(page, search, approvalFilter);
  }, [page, search, approvalFilter, fetchReviews]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearch("");
    setApprovalFilter("all");
    setPage(1);
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const docs = data?.docs || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName="Reviews"
        search={search}
        searchBy="Search By Title or Client Name..."
        slug="reviews"
      />

      {/* Approval Filter Controls */}
      <div className="my-4 flex items-center gap-2">
        <span className="text-sm text-[#8C7A6B]">Filter Status:</span>
        <button
          onClick={() => {
            setApprovalFilter("all");
            setPage(1);
          }}
          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
            approvalFilter === "all"
              ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
              : "bg-[#1A120D] text-[#A7897B] border-[#3A2A22] hover:border-[#8B5E3C]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setApprovalFilter("approved");
            setPage(1);
          }}
          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
            approvalFilter === "approved"
              ? "bg-green-700 text-white border-green-600"
              : "bg-[#1A120D] text-[#A7897B] border-[#3A2A22] hover:border-green-600"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => {
            setApprovalFilter("unapproved");
            setPage(1);
          }}
          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
            approvalFilter === "unapproved"
              ? "bg-amber-700 text-white border-amber-600"
              : "bg-[#1A120D] text-[#A7897B] border-[#3A2A22] hover:border-amber-600"
          }`}
        >
          Unapproved
        </button>
      </div>

      {/* Skeleton Loader Grid */}
      {isLoading ? (
        <ReviewsSkelaton length={9} />
      ) : docs.length === 0 ? (
        <div className="py-12 text-center text-[#8C7A6B]">
          No Reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {docs.map((review) => {
            const image =
              review.image?.ImageSource === "Url"
                ? review.image?.imageUrl
                : typeof review.image?.image === "object"
                  ? review.image?.image?.url
                  : "";

            const clientName = review.ClientName?.firstName || "Unknown Client";
            const countryName =
              review.country?.title || review.country?.name || "None";
            const isApproved = review.isApproved;

            return (
              <Link
                key={review.id}
                href={`${adminRoute}/collections/reviews/${review.id}`}
                className="group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] text-center no-underline transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl"
              >
                <div className="absolute top-2 right-2 z-10">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full shadow-md ${
                      isApproved
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {isApproved ? "Approved" : "Unapproved"}
                  </span>
                </div>

                <div className="w-full">
                  <div className="flex w-full h-48 items-center justify-center p-2 overflow-hidden bg-[#241812]">
                    {image ? (
                      <img
                        src={image}
                        alt={review.title || "Review Image"}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
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
                      title={review.title}
                    >
                      {review.title || "Untitled"}
                    </p>

                    {review.subtitle && (
                      <p className="mt-2 text-sm text-[#A7897B]">
                        {review.subtitle}
                      </p>
                    )}

                    {review.des && (
                      <p className="mt-2 line-clamp-3 text-sm text-[#A7897B]">
                        {review.des}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full border-t border-[#3A2A22] bg-[#241812] px-3 py-2 text-center space-y-1">
                  <div className="flex w-full items-center justify-between text-xs font-medium">
                    <p
                      className="truncate text-[#8C7A6B] max-w-[50%]"
                      title={clientName}
                    >
                      Client:{" "}
                      <span className="text-[#E8D8C3]">{clientName}</span>
                    </p>

                    <p
                      className="truncate text-[#8C7A6B] max-w-[50%]"
                      title={countryName}
                    >
                      Country:{" "}
                      <span className="text-[#E8D8C3]">{countryName}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-center pt-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const isFilled = index < (Number(review.rate) || 0);

                        return (
                          <img
                            key={index}
                            src={
                              isFilled
                                ? "/assets/icons8starfilled301.png"
                                : "/assets/icons8star49.png"
                            }
                            alt={isFilled ? "Filled Star" : "Empty Star"}
                            className="h-4 w-4 object-contain"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={totalPages}
          hasPrevPage={data.hasPrevPage}
          hasNextPage={data.hasNextPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
