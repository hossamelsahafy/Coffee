import React from "react";
import Link from "next/link";

const Header = ({
  adminRoute,
  CollectionName,
  handleResetSearch,
  handleSearch,
  search,
  searchBy,
  slug,
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-start gap-4">
        <p className="text-3xl font-bold">{CollectionName}</p>
        <Link
          href={`${adminRoute}/collections/${slug}/create`}
          className="inline-flex no-underline items-center gap-2 rounded-lg border border-[#8B5E3C] bg-[#3E2C22] px-4 py-2 text-sm font-medium text-[#F5E6D3] transition-all duration-200 hover:border-[#A06C45] hover:bg-[#52382A]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
          <span>Create New</span>
        </Link>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchBy}
            className="w-full rounded-lg border border-[#3A2A22] bg-[#1A120D] px-4 py-2 pr-10 text-sm text-[#E8D8C3] placeholder-[#8C7A6B] focus:border-[#8B5E3C] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#E8D8C3]"
              title="Clear text"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleResetSearch}
          disabled={!search}
          className="inline-flex items-center gap-2 rounded-lg border border-[#543E31] bg-[#241812] px-4 py-2 text-sm font-medium text-[#E8D8C3] transition-all duration-200 hover:border-[#8B5E3C] hover:bg-[#322219] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Show All / Reset
        </button>
      </div>
    </div>
  );
};

export default Header;
