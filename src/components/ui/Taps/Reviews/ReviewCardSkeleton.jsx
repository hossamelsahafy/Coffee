import React from "react";

const ReviewCardSkeleton = () => (
  <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md animate-pulse h-64">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-12 bg-white/10 rounded-md"></div>
        <div className="h-5 w-16 bg-white/10 rounded-full"></div>
      </div>
      <div className="h-32 w-full bg-white/10 rounded-xl"></div>
      <div className="h-5 w-3/4 bg-white/10 rounded-md"></div>
      <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
    </div>
  </div>
);

export default ReviewCardSkeleton;
