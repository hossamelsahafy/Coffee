import React from "react";

export const ProductsUiSkelatonForAdmin = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl animate-pulse h-[380px]"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 w-3/4">
                <div className="h-6 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
              <div className="h-5 bg-white/10 rounded-full w-16"></div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between">
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-4 bg-white/10 rounded w-24"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-white/10 rounded w-16"></div>
                <div className="h-4 bg-white/10 rounded w-12"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-white/10 pt-4">
            <div className="h-9 bg-white/10 rounded-xl w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsUiSkelatonForAdmin;
