"use client";
import React from "react";

import { useParams } from "next/navigation";

const CoffeeLoader = () => {
  const { locale } = useParams();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 w-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-full bg-base-coffe/20 animate-ping" />
        <div className="relative z-10 p-4 bg-base-coffe text-white rounded-2xl shadow-xl flex items-center justify-center">
          <svg
            className="w-8 h-8 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 1v3M10 1v3M14 1v3"
            />
          </svg>
        </div>
      </div>
      <span className="text-sm font-medium text-base- tracking-wide animate-pulse">
        {locale === "en"
          ? "Brewing products..."
          : "منتجات تحضير القهوة والشاي  ..."}
      </span>
    </div>
  );
};

export default CoffeeLoader;
