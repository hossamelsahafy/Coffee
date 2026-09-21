"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import GetDataWithPagination from "@/actions/GetDataWithPagination";

export default function CountrySelect({
  locale,
  countriesData,
  value,
  onChange,
  error,
  setToast,
}) {
  const t = useTranslations("ReviewForm");

  const [countries, setCountries] = useState(countriesData?.docs || []);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(countriesData?.page || 1);
  const [hasNextPage, setHasNextPage] = useState(
    Boolean(countriesData?.hasNextPage),
  );

  const [isAddingOther, setIsAddingOther] = useState(false);
  const [newCountryEn, setNewCountryEn] = useState("");
  const [newCountryAr, setNewCountryAr] = useState("");
  const [isSubmittingOther, setIsSubmittingOther] = useState(false);
  const [otherError, setOtherError] = useState("");

  const loadMoreTimeoutRef = useRef(null);

  const getCountryName = (country) => {
    if (!country) return "";

    if (locale === "ar") {
      return country.titleAr || country.title || "";
    }

    return country.title || country.titleAr || "";
  };

  const selectedCountry = countries.find(
    (country) => String(country.id) === String(value),
  );

  const loadMoreCountries = async () => {
    if (loadingCountries || !hasNextPage) return;

    setLoadingCountries(true);

    try {
      const nextPage = currentPage + 1;

      const data = await GetDataWithPagination(
        "countries",
        nextPage,
        10,
        "",
        {},
      );

      if (data?.docs?.length) {
        setCountries((prev) => {
          const merged = [...prev, ...data.docs];

          return Array.from(
            new Map(
              merged.map((country) => [String(country.id), country]),
            ).values(),
          );
        });
      }

      setCurrentPage(data?.page || nextPage);
      setHasNextPage(Boolean(data?.hasNextPage));
    } catch (err) {
      const message =
        locale === "en"
          ? "Error While Creating Country"
          : "حدث خطا اثناء اضافة دولة جديدة";
      setToast({
        message,
        type: "error",
      });
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleCountryScroll = (e) => {
    const element = e.currentTarget;

    const isNearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 30;

    if (!isNearBottom || loadingCountries || !hasNextPage) {
      return;
    }

    clearTimeout(loadMoreTimeoutRef.current);

    loadMoreTimeoutRef.current = setTimeout(() => {
      loadMoreCountries();
    }, 300);
  };

  useEffect(() => {
    return () => {
      clearTimeout(loadMoreTimeoutRef.current);
    };
  }, []);

  const handleCountrySelect = (country) => {
    onChange(country.id);
    setCountryOpen(false);
    setIsAddingOther(false);
  };

  const handleCreateOtherCountry = async () => {
    if (!newCountryEn.trim() && !newCountryAr.trim()) {
      setOtherError(
        t("CountryNameRequired") || "Please enter the country name.",
      );
      return;
    }

    setIsSubmittingOther(true);
    setOtherError("");

    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newCountryEn.trim() || newCountryAr.trim(),
          titleAr: newCountryAr.trim() || newCountryEn.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create country");
      }

      const data = await res.json();
      const createdCountry = data.doc || data;

      setCountries((prev) => [createdCountry, ...prev]);

      onChange(createdCountry.id);

      setIsAddingOther(false);
      setNewCountryEn("");
      setNewCountryAr("");
      setCountryOpen(false);
    } catch (err) {
      console.error("Error creating country:", err);

      setOtherError(
        t("FailedToCreateCountry") ||
          "Failed to create country. Please try again.",
      );
    } finally {
      setIsSubmittingOther(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-1.5">
      <label className="text-sm font-medium text-base-lighter">
        {t("CountryLabel")}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setCountryOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between bg-black/40 border p-2.5 rounded text-sm text-left transition focus:outline-none ${
            error ? "border-amber-200" : "border-base-borderTwo"
          }`}
        >
          <span
            className={selectedCountry ? "text-base-light" : "text-gray-500"}
          >
            {selectedCountry
              ? getCountryName(selectedCountry)
              : t("CountryPlaceholder")}
          </span>

          <span
            className={`transition-transform duration-200 ${
              countryOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        {countryOpen && (
          <div className="relative mt-1 w-full z-[100] rounded-lg border border-base-borderTwo bg-base-nav shadow-2xl overflow-hidden">
            <div
              onScroll={handleCountryScroll}
              className="max-h-60 overflow-y-auto overscroll-contain"
            >
              {countries.length > 0 ? (
                countries.map((country) => {
                  const isSelected = String(value) === String(country.id);

                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition ${
                        isSelected
                          ? "bg-base-coffe text-base-dark font-semibold"
                          : "text-base-light hover:bg-base-lighter/10"
                      }`}
                    >
                      {getCountryName(country)}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-center text-gray-500">
                  {loadingCountries
                    ? t("LoadingCountries") || "Loading countries..."
                    : t("NoCountriesFound") || "No countries found."}
                </div>
              )}

              {loadingCountries && (
                <div className="px-3 py-2 text-center text-xs text-gray-400">
                  {t("LoadingCountries") || "Loading more countries..."}
                </div>
              )}
            </div>

            {/* OTHER SECTION - NEVER SCROLLS */}
            <div className="shrink-0 p-2.5 border-t border-base-borderTwo bg-black/40">
              {!isAddingOther ? (
                <button
                  type="button"
                  onClick={() => setIsAddingOther(true)}
                  className="w-full py-1.5 px-3 bg-base-coffe/20 hover:bg-base-coffe/30 text-base-light text-xs font-semibold rounded transition text-center"
                >
                  + {t("OtherButton") || "Add Other Country"}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-base-light">
                      {t("AddNewCountry") || "Add New Country"}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingOther(false);
                        setOtherError("");
                      }}
                      className="text-xs text-gray-400 hover:text-base-light"
                    >
                      {t("Cancel") || "Cancel"}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={newCountryEn}
                    onChange={(e) => setNewCountryEn(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={
                      t("CountryNameEn") || "English Name (e.g. Canada)"
                    }
                    className="w-full bg-black/40 border border-base-borderTwo rounded p-2 text-xs text-base-light focus:outline-none focus:border-base-coffe"
                  />

                  <input
                    type="text"
                    value={newCountryAr}
                    onChange={(e) => setNewCountryAr(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={
                      t("CountryNameAr") || "Arabic Name (مثال: كندا)"
                    }
                    className="w-full bg-black/40 border border-base-borderTwo rounded p-2 text-xs text-base-light focus:outline-none focus:border-base-coffe"
                  />

                  {otherError && (
                    <span className="text-amber-200 text-xs">{otherError}</span>
                  )}

                  <button
                    type="button"
                    disabled={isSubmittingOther}
                    onClick={handleCreateOtherCountry}
                    className="w-full bg-base-coffe text-base-dark py-1.5 rounded text-xs font-semibold transition hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmittingOther
                      ? t("Saving") || "Saving..."
                      : t("SaveAndSelect") || "Save & Select"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-amber-200 text-xs">{error}</span>}
    </div>
  );
}
