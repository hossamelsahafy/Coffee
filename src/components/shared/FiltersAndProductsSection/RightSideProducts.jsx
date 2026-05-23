import React from "react";
import GridSwiper from "../Swiper/GridSwiper";
import Link from "next/link";
import { FiChevronsDown } from "react-icons/fi";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import ProductModal from "@/components/shared/Model/ProductModal";
import FilterModal from "@/components/shared/Model/FilterModal";
import ProductsCardAsColomns from "../Products/ProductsCardAsColomns";
import { VscSettings } from "react-icons/vsc";
import "@/styles/customScroller.css";

const RightSideProducts = ({
  locale,
  CurrentLocation,
  t,
  sortedData,
  setOpenModel,
  setSelectedProduct,
  sortType,
  setSortType,
  openModel,
  selectedProduct,
  selectedFilters,
  openFilterModal,
  setOpenFilterModal,
  FiltersLabel,
  Filters,
  collapsedFilters,
  selectLabel,
  resetLabel,
  minLabel,
  maxLabel,
  setSelectedFilters,
  toggleCollapse,
  toggleOption,
  resetFilter,
}) => {
  const sortOptions = [
    { value: "best_selling", en: "Best Selling", ar: "الأكثر مبيعًا" },
    {
      value: "price_low_high",
      en: "Price: Low to High",
      ar: "السعر: من الأقل للأعلى",
    },
    {
      value: "price_high_low",
      en: "Price: High to Low",
      ar: "السعر: من الأعلى للأقل",
    },
    { value: "a_z", en: "A → Z", ar: "من الألف إلى الياء" },
    { value: "z_a", en: "Z → A", ar: "من الياء إلى الألف" },
  ];
  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };
  const breakpoints = {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  };
  useLockBodyScroll(openModel);
  console.log(openFilterModal);

  return (
    <>
      <div className="flex-1 min-w-0 flex flex-col -mt-4">
        <div className="flex justify-between w-full">
          <div className="flex items-center md:hidden">
            <button
              className="cursor-pointer"
              onClick={() => setOpenFilterModal(true)}
            >
              <VscSettings className="text-2xl font-extrabold" />
            </button>
          </div>
          <div className="flex items-start p-4 gap-4 font-bold text-lg">
            <Link className="" href={`/${locale}`}>
              {t("home")}/{" "}
            </Link>
            <Link className="" href={"#productPage"}>
              {CurrentLocation}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">{t("SortBy")}:</span>
            <div className="relative w-fit">
              <select
                value={sortType}
                onChange={handleSortChange}
                className=" text-base-dark border font-semibold border-base-borderTwo px-3 py-2 pr-8 rounded-full cursor-pointer appearance-none ring-0 focus:ring-0"
              >
                {sortOptions.map((opt, idx) => (
                  <option
                    className="text-base-dark rounded-lg font-semibold"
                    key={idx}
                    value={opt.value}
                  >
                    {locale === "en" ? opt.en : opt.ar}
                  </option>
                ))}
              </select>
              <FiChevronsDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-base-light" />
            </div>
          </div>
        </div>
        <div className="w-full border-b border-base-borderTwo md:-ms-4"></div>
        <div className="flex-1 min-w-0">
          <GridSwiper
            filteredProducts={sortedData}
            loop={false}
            enablePagePagination={true}
            breakpoints={breakpoints}
            PaddingBottom="15px"
            renderItem={(product) => (
              <ProductsCardAsColomns
                product={product}
                locale={locale}
                setOpenModel={setOpenModel}
                setSelectedProduct={setSelectedProduct}
                isCustom={true}
                customBgColor="bg-base-Cards"
                customHoverBgColor="hover:bg-base-CardsFilters"
                selectedFilters={selectedFilters}
              />
            )}
          />
        </div>
      </div>
      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
          openFilterModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Left Sliding Panel */}
        <div
          className={`w-1/2 h-screen bg-base-light shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            openFilterModal ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <FilterModal
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
            setOpenFilterModal={setOpenFilterModal}
          />
        </div>

        {/* Dark Backdrop */}
        <div
          className={`w-1/2 h-screen bg-black/50 transition-opacity duration-300 ease-out cursor-pointer ${
            openFilterModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpenFilterModal(false)}
        />
      </div>
    </>
  );
};

export default RightSideProducts;
