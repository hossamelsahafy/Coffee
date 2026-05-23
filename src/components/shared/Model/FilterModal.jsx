import React from "react";
import Aside from "@/components/shared/FiltersAndProductsSection/Aside";
import { IoMdClose } from "react-icons/io";

const FilterModal = ({
  FiltersLabel,
  Filters,
  collapsedFilters,
  selectedFilters,
  selectLabel,
  resetLabel,
  minLabel,
  maxLabel,
  setSelectedFilters,
  toggleCollapse,
  toggleOption,
  locale,
  setOpenFilterModal,
  resetFilter,
}) => {
  return (
    <>
      <header className="w-full text-center p-4 bg-base-dark text-base-light relative">
        <span
          onClick={() => setOpenFilterModal(false)}
          className="absolute top-2 left-2 text-base-light cursor-pointer"
        >
          <IoMdClose className="text-xl font-bold" />
        </span>
        {FiltersLabel}
      </header>

      <div className="h-full overflow-y-auto [direction:rtl] coffee-scroller">
        <div className="[direction:ltr] p-4">
          <Aside
            FiltersLabel={FiltersLabel}
            Filters={Filters}
            collapsedFilters={collapsedFilters}
            selectedFilters={selectedFilters}
            selectLabel={selectLabel}
            resetLabel={resetLabel}
            minLabel={minLabel}
            maxLabel={maxLabel}
            setSelectedFilters={setSelectedFilters}
            toggleCollapse={toggleCollapse}
            toggleOption={toggleOption}
            locale={locale}
            resetFilter={resetFilter}
          />
        </div>
      </div>
    </>
  );
};

export default FilterModal;
