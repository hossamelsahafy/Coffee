import React from "react";

const OrderCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full h-full justify-between gap-4 rounded-2xl border border-base-nav/50 bg-base-dark/20 p-5 shadow-lg backdrop-blur-xl animate-pulse">
      <div className="flex flex-col gap-4 w-full flex-1">
        <div className="flex justify-between items-center w-full">
          <div className="h-4 w-24 bg-base-nav/40 rounded-md"></div>
          <div className="h-6 w-20 bg-base-nav/40 rounded-full"></div>
        </div>

        <div className="flex w-full justify-between items-center mt-2">
          <div className="h-4 w-32 bg-base-nav/30 rounded-md"></div>
          <div className="h-6 w-24 bg-base-nav/40 rounded-full"></div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="h-4 w-32 bg-base-nav/30 rounded-md"></div>
          <div className="h-6 w-16 bg-base-nav/30 rounded-md"></div>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="h-4 w-32 bg-base-nav/30 rounded-md"></div>
          <div className="h-6 w-20 bg-base-nav/30 rounded-md"></div>
        </div>

        <div className="flex flex-1 flex-col justify-center my-auto w-full pt-4">
          <div className="flex flex-row gap-3 flex-wrap items-center justify-center content-center">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-20 h-20 sm:w-24 sm:h-24 flex shrink-0 rounded-lg border border-base-nav/20 bg-base-dark/30"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-auto w-full items-center justify-between pt-2">
        <div className="h-10 w-full bg-base-nav/40 rounded-lg"></div>
        <div className="h-10 w-full bg-base-nav/30 rounded-lg"></div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
