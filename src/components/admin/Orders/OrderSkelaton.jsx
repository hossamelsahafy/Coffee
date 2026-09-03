import React from "react";

const OrderSkelaton = ({ limit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: limit }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-[380px]"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-6 w-28 bg-white/10 rounded" />
              </div>
              <div className="h-6 w-20 bg-white/10 rounded-full" />
            </div>
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-16 bg-white/10 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-20 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <div className="h-9 w-32 bg-white/10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkelaton;
