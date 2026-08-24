import React from "react";

const ProductsCardAsColomnsSkeleton = ({ isCustom }) => {
  return (
    <div
      className={`flex flex-col items-stretch gap-4 w-full h-full ${
        isCustom ? "bg-coffeText/40" : "bg-coffeText"
      } rounded-lg p-4 mt-4 animate-pulse`}
    >
      <div className="flex justify-between w-full items-start gap-2">
        <div className="flex flex-col gap-2 items-center">
          <div className="w-10 h-5 bg-base-light/25 rounded-md" />
        </div>

        <div className="flex max-h-50 justify-center relative h-50 w-50 bg-base-light/10 rounded-md" />

        <div className="flex flex-col justify-center gap-3 items-center py-1">
          <div className="w-4 h-4 bg-base-light/25 rounded-full" />
          <div className="w-4 h-4 bg-base-light/25 rounded-full" />
        </div>
      </div>

      <div className="w-3/4 h-7 bg-base-light/25 rounded-md my-1" />

      <div className="w-full h-10 bg-base-light/15 rounded-md" />

      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <div className="w-16 h-5 bg-base-light/25 rounded-md" />
          <div className="w-12 h-3 bg-base-light/15 rounded-md" />
        </div>

        <div className="w-24 h-6 bg-base-light/20 rounded-md" />
      </div>
    </div>
  );
};

export default ProductsCardAsColomnsSkeleton;
