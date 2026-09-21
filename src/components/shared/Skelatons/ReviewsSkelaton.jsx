import React from "react";

const ReviewsSkelaton = ({ length }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 animate-pulse">
      {Array.from({ length: length }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#3A2A22] bg-[#1A120D] h-72"
        >
          <div className="w-full h-48 bg-[#241812]" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-[#3A2A22] rounded w-3/4 mx-auto" />
            <div className="h-3 bg-[#3A2A22] rounded w-1/2 mx-auto" />
          </div>
          <div className="w-full border-t border-[#3A2A22] bg-[#241812] px-3 py-2">
            <div className="h-3 bg-[#3A2A22] rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsSkelaton;
