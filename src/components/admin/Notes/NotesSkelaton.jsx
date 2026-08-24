"use client";

import React from "react";

export function NotesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#3A2A22] bg-[#120c0a]"
        >
          <div className="aspect-square w-full bg-[#241812]" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 bg-[#241812] rounded mx-auto" />
            <div className="h-3 w-1/2 bg-[#241812] rounded mx-auto" />
          </div>
          <div className="flex p-2 w-full justify-between items-center border-t border-[#3A2A22]">
            <div className="h-3 w-12 bg-[#241812] rounded" />
            <div className="h-3 w-16 bg-[#241812] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
