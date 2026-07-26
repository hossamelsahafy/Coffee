import { useMemo } from "react";
import {
  getCategories,
  getProductsType,
  getProductsOptions,
} from "@/lib/sortAndFilterProducts";
export const useAttributeCounts = (data, filteredData, attributeConfig) => {
  return useMemo(() => {
    let getAllItems;
    let getFilteredKey;

    if (attributeConfig === "category") {
      getAllItems = () => getCategories(data);
      getFilteredKey = (product) => product.category?.title;
    } else if (attributeConfig === "type") {
      getAllItems = () => getProductsType(data);
      getFilteredKey = (product) => product.type;
    } else {
      getAllItems = () => getProductsOptions(data, attributeConfig);
      getFilteredKey = (product) => {
        const choices = product.choices;
        if (choices?.choiceType === attributeConfig) {
          return choices.options?.map((o) => o.value) || [];
        }
        return [];
      };
    }

    const filteredCounts = {};

    filteredData.forEach((product) => {
      const keys = getFilteredKey(product);
      const keyArray = Array.isArray(keys) ? keys : [keys];

      keyArray.forEach((key) => {
        if (key) {
          filteredCounts[key] = (filteredCounts[key] || 0) + 1;
        }
      });
    });

    return getAllItems().map((item) => ({
      ...item,
      count: filteredCounts[item.value] || 0,
    }));
  }, [data, filteredData, attributeConfig]);
};

export default useAttributeCounts;
