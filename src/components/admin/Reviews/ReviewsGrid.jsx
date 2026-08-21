"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useListQuery, useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";

export default function ReviewsGrid() {
  const { data, isLoading, handleWhereChange, handlePageChange } =
    useListQuery();

  const { config } = useConfig();

  const adminRoute = config.routes?.admin || "/admin";

  const [search, setSearch] = useState("");
  const [clients, setClients] = useState({});
  const [countries, setCountries] = useState({});

  const docs = data?.docs || [];

  useEffect(() => {
    if (!docs.length) {
      setClients({});
      setCountries({});
      return;
    }

    const clientIds = [
      ...new Set(
        docs
          .map((review) => {
            if (!review.ClientName) return null;

            if (typeof review.ClientName === "string") {
              return review.ClientName;
            }

            if (typeof review.ClientName === "object") {
              return review.ClientName.id;
            }

            return null;
          })
          .filter(Boolean),
      ),
    ];

    const countryIds = [
      ...new Set(
        docs
          .map((review) => {
            if (!review.country) return null;

            if (typeof review.country === "string") {
              return review.country;
            }

            if (typeof review.country === "object") {
              return review.country.id;
            }

            return null;
          })
          .filter(Boolean),
      ),
    ];

    const fetchData = async () => {
      try {
        const [clientsResponse, countriesResponse] = await Promise.all([
          clientIds.length
            ? fetch(
                `/api/users?where[id][in]=${clientIds.join(",")}&limit=${clientIds.length}&depth=0`,
              )
            : null,

          countryIds.length
            ? fetch(
                `/api/countries?where[id][in]=${countryIds.join(",")}&limit=${countryIds.length}&depth=0`,
              )
            : null,
        ]);

        if (clientsResponse?.ok) {
          const usersData = await clientsResponse.json();

          const clientsMap = {};

          usersData.docs.forEach((user) => {
            clientsMap[user.id] = {
              id: user.id,
              firstName: user.firstName || "Unknown",
            };
          });

          setClients(clientsMap);
        } else {
          setClients({});
        }

        if (countriesResponse?.ok) {
          const countriesData = await countriesResponse.json();

          const countriesMap = {};

          countriesData.docs.forEach((country) => {
            countriesMap[country.id] = {
              id: country.id,
              name: country.title || country.name || "Country",
            };
          });

          setCountries(countriesMap);
        } else {
          setCountries({});
        }
      } catch (error) {
        console.error("Failed to fetch relational data:", error);
      }
    };

    fetchData();
  }, [docs]);

  const handleSearch = (value) => {
    setSearch(value);

    const trimmed = value.trim();
    if (!trimmed) {
      handleWhereChange({});
      return;
    }

    handleWhereChange({
      or: [
        {
          title: {
            contains: trimmed,
          },
        },
        {
          "country.title": {
            contains: trimmed,
          },
        },
      ],
    });
  };

  const handleResetSearch = () => {
    setSearch("");
    handleWhereChange({});
  };

  if (isLoading) {
    return <div className="p-6 text-[#E8D8C3]">Loading...</div>;
  }

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
          CollectionName="Reviews"
          search={search}
          searchBy="Search By Title or Country..."
          slug="reviews"
        />

        {docs.length === 0 ? (
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

              const clientId =
                typeof review.ClientName === "string"
                  ? review.ClientName
                  : review.ClientName?.id;
              const client = clientId ? clients[clientId] : null;

              const countryId =
                typeof review.country === "string"
                  ? review.country
                  : review.country?.id;
              const country = countryId ? countries[countryId] : null;

              return (
                <Link
                  key={review.id}
                  href={`${adminRoute}/collections/reviews/${review.id}`}
                  className="group flex flex-col items-center justify-between overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] text-center no-underline transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl"
                >
                  <div className="w-full">
                    <div className="flex w-full items-center justify-center overflow-hidden bg-[#241812]">
                      {image ? (
                        <img
                          src={image}
                          alt={review.title || "Review Image"}
                          className="max-w-50 object-contain transition duration-300 group-hover:scale-105"
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
                        title={client?.firstName || clientId}
                      >
                        Client:{" "}
                        <span className="text-[#E8D8C3]">
                          {client?.firstName || "Loading..."}
                        </span>
                      </p>

                      <p
                        className="truncate text-[#8C7A6B] max-w-[50%]"
                        title={country?.name || countryId}
                      >
                        Country:{" "}
                        <span className="text-[#E8D8C3]">
                          {country?.name || (countryId ? "Loading..." : "None")}
                        </span>
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
