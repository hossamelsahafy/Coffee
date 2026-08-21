"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";

const Aside = ({
  FiltersLabel,
  locale,
  Filters = [],
  collapsedFilters = {},
  selectLabel,
  resetLabel,
  toggleCollapse,
  minLabel,
  maxLabel,
  selectedFilters = {},
  toggleOption,
  resetFilter,
  onPriceChange,
}) => {
  const [minPrice, setMinPrice] = useState(selectedFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(selectedFilters.maxPrice || "");

  useEffect(() => {
    setMinPrice(selectedFilters.minPrice || "");
    setMaxPrice(selectedFilters.maxPrice || "");
  }, [selectedFilters.minPrice, selectedFilters.maxPrice]);

  const handlePriceBlur = () => {
    if (onPriceChange) {
      onPriceChange(minPrice, maxPrice);
    }
  };

  return (
    <div className="flex flex-col md:mb-0 mb-4">
      <div className="p-4 hidden md:flex">
        <p className="text-lg font-bold">{FiltersLabel}</p>
      </div>

      <div className="border-b md:flex hidden w-full border-base-borderTwo ms-4" />

      <div className="p-4">
        {Filters.map((filter) => {
          const selectedItems = selectedFilters[filter.id] || [];

          return (
            <div key={filter.id} className="flex flex-col w-full gap-4 mb-4">
              {/* Header section with toggle collapse button */}
              <div className="flex justify-between w-full items-center text-lg font-semibold">
                <p>{filter.title?.[locale] || filter.title}</p>

                <button
                  type="button"
                  onClick={() => toggleCollapse(filter.id)}
                  className="cursor-pointer p-1"
                  aria-label="Toggle filter visibility"
                >
                  {collapsedFilters[filter.id] ? <FaPlus /> : <FaMinus />}
                </button>
              </div>

              {/* Collapsible Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  collapsedFilters[filter.id]
                    ? "max-h-0 opacity-0"
                    : "max-h-[1000px] opacity-100"
                }`}
              >
                {filter.id === "Price" ? (
                  <div className="flex flex-col gap-4 pt-2">
                    <div className="flex justify-between w-full items-center">
                      <p className="text-sm text-gray-600">
                        {locale === "en" ? filter.subtitle : filter.subtitleAr}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");
                          resetFilter("Price");
                        }}
                        className="cursor-pointer text-sm font-medium hover:underline"
                      >
                        {resetLabel}
                      </button>
                    </div>

                    <div className="flex w-full gap-4 justify-between items-start text-start">
                      {/* MIN PRICE */}
                      <div className="flex-1 flex flex-col justify-start gap-2">
                        <label className="text-sm font-medium">
                          {minLabel}
                        </label>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          onBlur={handlePriceBlur}
                          placeholder="0"
                          className="w-full rounded-lg p-2 border border-base-light focus:outline-none focus:ring-1 focus:ring-base-coffee focus:border-base-coffee [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>

                      {/* MAX PRICE */}
                      <div className="flex-1 flex flex-col justify-start gap-2">
                        <label className="text-sm font-medium">
                          {maxLabel}
                        </label>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          onBlur={handlePriceBlur}
                          placeholder="Max"
                          className="w-full rounded-lg p-2 border border-base-light focus:outline-none focus:ring-1 focus:ring-base-coffee focus:border-base-coffee [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Filter count header */}
                    <div className="flex justify-between w-full items-center mb-2">
                      <div className="flex gap-1 items-center text-sm font-semibold">
                        <span>{selectedItems.length}</span>
                        <p>{selectLabel}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => resetFilter(filter.id)}
                        className="cursor-pointer text-sm hover:underline"
                      >
                        {resetLabel}
                      </button>
                    </div>

                    {/* Filter Option List */}
                    <div className="pt-2 flex flex-col gap-3">
                      {filter.options?.map((o, i) => {
                        const isChecked = selectedItems.includes(o.value);

                        return (
                          <div
                            key={i}
                            className="flex w-full justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleOption(filter.id, o.value)}
                          >
                            <div className="flex gap-2 items-center text-sm">
                              <button
                                type="button"
                                className="cursor-pointer text-base-dark"
                                aria-label={`Select ${o.label?.[locale] || o.label}`}
                              >
                                {isChecked ? (
                                  <MdOutlineCheckBox size={22} />
                                ) : (
                                  <MdCheckBoxOutlineBlank size={22} />
                                )}
                              </button>
                              <span>
                                {o.label?.[locale] || o.label || o.value}
                              </span>
                            </div>

                            {o.count !== undefined && (
                              <span className="text-xs text-gray-500">
                                ({o.count})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="-me-4 pt-2">
                <div className="border-t border-[#E2E2E2] opacity-45" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Aside;
