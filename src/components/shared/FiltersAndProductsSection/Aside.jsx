import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";

const Aside = ({
  FiltersLabel,
  locale,
  Filters,
  collapsedFilters,
  selectLabel,
  resetLabel,
  toggleCollapse,
  minLabel,
  maxLabel,
  selectedFilters,
  setSelectedFilters,
  toggleOption,
  resetFilter,
}) => {
  return (
    <div className="flex flex-col md:mb-0 mb-4">
      <div className="p-4 hidden md:flex">
        <p className="text-lg font-bold">{FiltersLabel}</p>
      </div>

      <div className="border-b md:flex hidden w-full border-base-borderTwo ms-4" />

      <div className="p-4">
        {Filters.map((filter) => (
          <div key={filter.id} className="flex flex-col w-full gap-4">
            <div className="flex justify-between w-full items-center text-lg font-semibold">
              <p>{filter.title[locale]}</p>

              <button
                onClick={() => toggleCollapse(filter.id)}
                className="cursor-pointer"
              >
                {collapsedFilters[filter.id] ? <FaPlus /> : <FaMinus />}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                collapsedFilters[filter.id]
                  ? "max-h-0 opacity-0"
                  : "max-h-250 opacity-100"
              }`}
            >
              {filter.id === "Price" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between w-full">
                    <p>
                      {locale === "en" ? filter.subtitle : filter.subtitleAr}
                    </p>
                    <button
                      onClick={() => resetFilter(filter.id)}
                      className="cursor-pointer"
                    >
                      {resetLabel}
                    </button>
                  </div>
                  <div className="flex w-full gap-4 justify-between items-start text-start">
                    {/* MIN */}
                    <div className="flex-1 flex flex-col justify-start gap-2">
                      <label>{minLabel}</label>

                      <input
                        type="number"
                        value={selectedFilters.minPrice}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            minPrice: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className="
        w-full rounded-lg p-2 border border-base-light
        focus:outline-none
        focus:ring-base-coffe
        focus:border
        focus:border-base-coffe
        [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
      "
                      />
                    </div>

                    {/* MAX */}
                    <div className="flex-1 flex flex-col justify-start gap-2">
                      <label>{maxLabel}</label>

                      <input
                        type="number"
                        value={selectedFilters.maxPrice}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value,
                          }))
                        }
                        className="
        w-full rounded-lg p-2 border border-base-light
        focus:outline-none
        focus:ring-base-coffe
        focus:border
        focus:border-base-coffe
        [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
      "
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between w-full items-center">
                    <div className="flex gap-1 items-center text-base font-semibold">
                      <span>{selectedFilters[filter.id]?.length || 0}</span>
                      <p>{selectLabel}</p>
                    </div>

                    <button
                      onClick={() => resetFilter(filter.id)}
                      className="cursor-pointer"
                    >
                      {resetLabel}
                    </button>
                  </div>

                  <div className="pt-2">
                    {filter.options.map((o, i) => {
                      const isChecked = selectedFilters[filter.id]?.includes(
                        o.value,
                      );

                      return (
                        <label key={i} className="flex flex-col gap-5">
                          <div className="flex w-full justify-between items-start">
                            {/* CHECKBOX */}
                            <div className="gap-1 flex items-center">
                              <button
                                disabled={o.count === 0}
                                onClick={() => toggleOption(filter.id, o.value)}
                              >
                                {isChecked ? (
                                  <MdOutlineCheckBox size={24} />
                                ) : (
                                  <MdCheckBoxOutlineBlank size={24} />
                                )}
                              </button>

                              <span>{o.label[locale]}</span>
                            </div>

                            <p>({o.count})</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="-me-4">
              <div className="border-t border-[#E2E2E2] opacity-45 mb-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aside;
