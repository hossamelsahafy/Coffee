"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import SlugMethods from "@/actions/SlugMethods";

export default function SearchOrderCard() {
  const t = useTranslations("TrackOrder");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderInput, setOrderInput] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const trimmedInput = orderInput.trim();
    const orderRegex = /^ORD-\d+$/i;

    if (!orderRegex.test(trimmedInput)) {
      setError(
        t("invalidFormatError") || "Please enter a valid order number format.",
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint = `orders?where[orderNumber][equals]=${encodeURIComponent(trimmedInput)}`;
      const orderData = await SlugMethods(endpoint, "GET");

      if (!orderData?.docs || orderData.docs.length === 0) {
        setError(t("notFoundError") || "No order found with this number.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        t("successMessage") || "Order found successfully! Redirecting...",
      );

      const params = new URLSearchParams(searchParams.toString());
      params.set("order", trimmedInput);

      setTimeout(() => {
        router.push(`?${params.toString()}`);
      }, 500);
    } catch (err) {
      setError(
        err?.message ||
          t("fetchError") ||
          "Failed to fetch order. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">
          {t("searchTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-400">{t("searchSubtitle")}</p>
      </div>

      <form onSubmit={handleTrack} className="mt-8">
        <label
          htmlFor="orderNumber"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          {t("orderNumber")}
        </label>

        <input
          id="orderNumber"
          type="text"
          dir="ltr"
          value={orderInput}
          onChange={(e) => setOrderInput(e.target.value)}
          placeholder={t("placeholder")}
          disabled={loading}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#D8A46B] focus:ring-2 focus:ring-[#D8A46B]/20 disabled:opacity-50"
        />

        {error && (
          <p className="mt-3 text-xs text-[#E5A996] font-medium bg-[#5C2424]/40 p-3 rounded-xl border border-[#E5A996]/30">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mt-3 text-xs text-[#A3C1AD] font-medium bg-[#2C4033]/40 p-3 rounded-xl border border-[#A3C1AD]/30">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#C07A3B] px-5 py-4 font-semibold text-white transition hover:bg-[#D8A46B] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>{t("searching")}</span>
            </>
          ) : (
            t("trackOrder")
          )}
        </button>
      </form>
    </div>
  );
}
