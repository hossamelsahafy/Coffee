"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useField, useConfig } from "@payloadcms/ui";
import Pagination from "@/components/shared/AdminUI/Pagination";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export interface CustomMediaSelectionProps {
  path: string;
  label?: string;
  relationTo?: string;
}

export const CustomMediaSelection: React.FC<CustomMediaSelectionProps> = ({
  path,
  label = "Select Image",
  relationTo = "media",
}) => {
  const { value, setValue } = useField<string | null>({
    path,
  });

  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [search, setSearch] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 20;

  useEffect(() => {
    const payloadValue =
      typeof value === "string"
        ? value
        : Array.isArray(value) && value.length > 0
          ? String(value[0])
          : null;

    setSelectedId(payloadValue);
  }, [value]);

  const fetchMedia = async (targetPage = 1) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `/api/${relationTo}?limit=${limit}&page=${targetPage}&sort=-createdAt`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch media");
      }

      const data = await res.json();

      setMediaItems(data.docs || []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setHasPrevPage(data.hasPrevPage || false);
      setHasNextPage(data.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(1);
  }, [relationTo]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMedia(newPage);
    }
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    setValue(id);
  };

  const filteredMedia = mediaItems.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="w-full font-sans text-[#eae0d5] mb-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="block font-medium text-sm text-[#f3ece7]">
          {label}
        </label>
      </div>

      <input
        type="text"
        placeholder="Search by filename in current page..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-[#271d18] text-[#eae0d5] placeholder-[#9e8a78] border border-[#423128] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c89553]"
      />

      {isLoading && mediaItems.length === 0 ? (
        <div className="w-full mb-4 p-8 flex items-center justify-center text-[#9e8a78] bg-[#1a120d] rounded-xl border border-[#3a2a22] animate-pulse">
          <span className="font-medium text-sm tracking-wide">
            Loading media library...
          </span>
        </div>
      ) : (
        <div className="p-3 bg-[#120c0a] border border-[#3a2a22] rounded-xl shadow-inner">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredMedia.length > 0 ? (
              filteredMedia.map((item) => {
                const isSelected = selectedId === String(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={(e) => handleSelect(String(item.id), e)}
                    className={`group relative cursor-pointer rounded-lg overflow-hidden border transition-all aspect-square ${
                      isSelected
                        ? "border-[#c89553] ring-2 ring-[#c89553] bg-[#271d18]"
                        : "border-[#3a2a22] bg-[#1a120d] hover:border-[#8c6a51]"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#120c0a] via-[#120c0a]/60 to-transparent flex items-end p-2">
                      <p className="text-xs text-[#e8d8c3] truncate w-full font-medium">
                        {item.filename}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#c89553] text-[#120c07] rounded-full flex items-center justify-center shadow-md font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-[#9e8a78]">
                No media found.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 pt-3 border-t border-[#3a2a22] w-full">
              <Pagination
                page={page}
                totalPages={totalPages}
                hasPrevPage={hasPrevPage}
                hasNextPage={hasNextPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomMediaSelection;
