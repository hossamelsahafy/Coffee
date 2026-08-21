import React from "react";

export const CategoriesSkelaton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="group overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] animate-pulse flex flex-col justify-between"
        >
          <div className="aspect-square w-full bg-[#241812] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#3A2A22]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="border-t border-[#3A2A22] bg-[#1A120D] p-3 flex justify-center">
            <div className="h-4 w-3/4 bg-[#271d18] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSkelaton;
