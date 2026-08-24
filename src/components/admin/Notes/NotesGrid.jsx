"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";
import { NotesSkeleton } from "./NotesSkelaton";

export default function NotesGrid() {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [importantFilter, setImportantFilter] = useState("all"); // "all" | "true" | "false"

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 6;

  const fetchNotes = async (
    targetPage = 1,
    searchValue = "",
    isImportantVal = "all",
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

      if (isImportantVal !== "all") {
        params.set("where[isImportant][equals]", isImportantVal);
      }

      const res = await fetch(`/api/Notes?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();

      setDocs(data.docs || []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setHasPrevPage(data.hasPrevPage || false);
      setHasNextPage(data.hasNextPage || false);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1, "", "all");
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    fetchNotes(1, value, importantFilter);
  };

  const handleResetSearch = () => {
    setSearch("");
    setImportantFilter("all");
    fetchNotes(1, "", "all");
  };

  const handleFilterClick = (value) => {
    setImportantFilter(value);
    fetchNotes(1, search, value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNotes(newPage, search, importantFilter);
    }
  };

  return (
    <div className="p-6 text-[#E8D8C3]">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName="Notes"
        search={search}
        searchBy="Search By Title ..."
        slug="Notes"
      />

      {/* Filter pills for isImportant */}
      <div className="mb-4 flex flex-wrap items-center gap-3 px-1 mt-4">
        <span className="text-xs font-semibold tracking-wider text-[#9E8A78]">
          IMPORTANCE FILTER:
        </span>
        <button
          type="button"
          onClick={() => handleFilterClick("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer outline-none border-0 ${
            importantFilter === "all"
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
            importantFilter === "true"
              ? "bg-[#c89553] text-[#120c07] shadow"
              : "bg-[#1A120D] text-[#E8D8C3] hover:bg-[#271d18]"
          }`}
        >
          Important
        </button>
        <button
          type="button"
          onClick={() => handleFilterClick("false")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer outline-none border-0 ${
            importantFilter === "false"
              ? "bg-[#c89553] text-[#120c07] shadow"
              : "bg-[#1A120D] text-[#E8D8C3] hover:bg-[#271d18]"
          }`}
        >
          Normal
        </button>
      </div>

      <div className="p-4 bg-[#1A120D] border border-[#3A2A22] rounded-2xl shadow-xl">
        {isLoading ? (
          <NotesSkeleton />
        ) : docs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No Notes found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {docs.map((note) => {
              const image =
                note.ImageSource === "Url"
                  ? note.ImageUrl
                  : typeof note.ImageUpload === "object"
                    ? note.ImageUpload?.url
                    : "";

              return (
                <Link
                  key={note.id}
                  href={`${adminRoute}/collections/Notes/${note.id}`}
                  className="group flex flex-col justify-between items-center overflow-hidden rounded-xl border border-[#3A2A22] bg-[#120c0a] text-center no-underline transition-all duration-300 hover:border-[#8B5E3C] hover:shadow-xl relative"
                >
                  {/* Importance Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                        note.isImportant
                          ? "bg-[#c89553] text-[#120c07]"
                          : "bg-[#271d18] text-[#9E8A78]"
                      }`}
                    >
                      {note.isImportant ? "Important" : "Normal"}
                    </span>
                  </div>

                  <div className="w-full">
                    <div className="aspect-square w-full flex items-center justify-center overflow-hidden bg-[#241812]">
                      {image ? (
                        <img
                          src={image}
                          alt={note.title || "Blog Image"}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#8B7768]">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p
                        className="text-sm font-semibold text-[#E8D8C3] truncate"
                        title={note.title}
                      >
                        {note.title || "Untitled"}
                      </p>

                      {note.des && (
                        <p className="mt-2 text-xs text-[#9E8A78] line-clamp-2">
                          {note.des}
                        </p>
                      )}
                    </div>

                    <div className="flex p-2 text-xs w-full justify-between items-center border-t border-[#3A2A22] bg-[#1A120D] text-[#9E8A78]">
                      <span>Brand</span>
                      <span className="text-[#E8D8C3] font-medium truncate max-w-[80px]">
                        {note.brandName || "-"}
                      </span>
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
