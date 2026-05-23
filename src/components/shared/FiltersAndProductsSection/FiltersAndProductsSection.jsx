"use client";
import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  getSortedData,
  getStockCounts,
  HigherPrice,
  getPrice,
} from "@/lib/sortAndFilterProducts";
import RightSideProducts from "./RightSideProducts";
import useAttributeCounts from "@/hooks/useAttributeCounts";
import useFilterConfig from "@/lib/FilterConfig";
import Aside from "./Aside";
const FiltersAndProductsSection = ({ CurrentLocation, locale, data }) => {
  const t = useTranslations("FiltersAndProductsSection");
  const [sortType, setSortType] = useState("best_selling");
  const sortedData = getSortedData(data, sortType, locale);
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { inStock, outOfStock } = getStockCounts(sortedData);
  let currency = locale === "en" ? "USD" : "دولار";
  const [collapsedFilters, setCollapsedFilters] = useState({});
  const [openFilterModal, setOpenFilterModal] = useState(false);
  let HigherP = HigherPrice(data);
  const defaultFilters = {
    availability: [],
    minPrice: "",
    maxPrice: HigherP,
    category: [],
    type: [],
    colors: [],
    quantity: [],
    sizes: [],
  };

  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);

  const filterData = (data, filters) => {
    return data.filter((product) => {
      const options = product.choices?.options || [];

      const hasInStock = options.some((o) => o.availability === "inStock");

      const hasOutOfStock = options.some(
        (o) => o.availability === "outOfStock",
      );

      if (filters.availability.length > 0) {
        const ok =
          (filters.availability.includes("in_stock") && hasInStock) ||
          (filters.availability.includes("out_stock") && hasOutOfStock);

        if (!ok) return false;
      }
      const productPrice = getPrice(product);

      const min = Number(filters.minPrice) || 0;
      const max = Number(filters.maxPrice) || Infinity;

      if (productPrice < min || productPrice > max) {
        return false;
      }
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.category.title)
      ) {
        return false;
      }
      if (filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false;
      }
      if (
        filters.colors.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.colors.includes(option.value),
        )
      ) {
        return false;
      }
      if (
        filters.sizes.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.sizes.includes(option.value),
        )
      ) {
        return false;
      }
      if (
        filters.quantity.length > 0 &&
        !product.choices?.options?.some((option) =>
          filters.quantity.includes(option.value),
        )
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredData = useMemo(
    () => filterData(sortedData, selectedFilters),
    [sortedData, selectedFilters],
  );

  const toggleCollapse = (id) => {
    setCollapsedFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetFilter = (id) => {
    if (id === "Price") {
      setSelectedFilters((prev) => ({
        ...prev,
        minPrice: "",
        maxPrice: HigherP,
      }));

      return;
    }

    setSelectedFilters((prev) => ({
      ...prev,
      [id]: defaultFilters[id],
    }));
  };

  const toggleOption = (key, value) => {
    setSelectedFilters((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const dataType = useAttributeCounts(data, filteredData, "type", true);
  const dataColors = useAttributeCounts(data, filteredData, "color");
  const dataSizes = useAttributeCounts(data, filteredData, "size");
  const dataQuantity = useAttributeCounts(data, filteredData, "quantity");
  const categories = useAttributeCounts(data, filteredData, "category");

  const Filters = useFilterConfig({
    inStock,
    outOfStock,
    HigherP,
    currency,
    categories,
    dataType,
    dataColors,
    dataSizes,
    dataQuantity,
  });
  return (
    <div className="container-custom p-4 md:min-h-screen h-auto flex flex-col">
      <div className="flex gap-4 w-full md:min-h-screen h-auto text-base-dark">
        <div className="md:block hidden w-1/4 border-e border-base-borderTwo -my-4 -ml-4 overflow-hidden">
          <Aside
            FiltersLabel={t("Filters")}
            Filters={Filters}
            collapsedFilters={collapsedFilters}
            selectedFilters={selectedFilters}
            selectLabel={t("selected")}
            resetLabel={t("reset")}
            minLabel={t("min")}
            maxLabel={t("max")}
            setSelectedFilters={setSelectedFilters}
            toggleCollapse={toggleCollapse}
            toggleOption={toggleOption}
            locale={locale}
            resetFilter={resetFilter}
          />
        </div>

        <RightSideProducts
          t={t}
          sortedData={filteredData}
          setOpenModel={setOpenModel}
          locale={locale}
          CurrentLocation={CurrentLocation}
          setSelectedProduct={setSelectedProduct}
          sortType={sortType}
          setSortType={setSortType}
          openModel={openModel}
          selectedProduct={selectedProduct}
          selectedFilters={selectedFilters}
          openFilterModal={openFilterModal}
          setOpenFilterModal={setOpenFilterModal}
          FiltersLabel={t("Filters")}
          Filters={Filters}
          collapsedFilters={collapsedFilters}
          selectLabel={t("selected")}
          resetLabel={t("reset")}
          minLabel={t("min")}
          maxLabel={t("max")}
          setSelectedFilters={setSelectedFilters}
          toggleCollapse={toggleCollapse}
          toggleOption={toggleOption}
          resetFilter={resetFilter}
        />
      </div>
    </div>
  );
};

export default FiltersAndProductsSection;
