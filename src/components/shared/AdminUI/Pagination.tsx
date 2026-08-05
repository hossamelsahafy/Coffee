"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-[#6b4a37]/30 px-4 py-4 mt-6">
      <div className="text-sm !text-[#e2cca6]">
        Page <span className="font-semibold !text-white">{page}</span> of{" "}
        <span className="font-semibold !text-white">{totalPages}</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border cursor-pointer border-[#6b4a37] bg-[#442e22] px-3 py-1.5 text-sm font-medium !text-[#fff9f0] transition-colors hover:bg-[#513728] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border cursor-pointer border-[#6b4a37] bg-[#442e22] px-3 py-1.5 text-sm font-medium !text-[#fff9f0] transition-colors hover:bg-[#513728] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
