import { useMemo } from "react";
const cleanOptions = (options) => options?.filter((o) => o.count > 0);
const useFiltersConfig = ({
  inStock,
  outOfStock,
  HigherP,
  currency,
  categories,
  dataType,
  dataColors,
  dataSizes,
  dataQuantity,
}) => {
  return useMemo(() => {
    const filters = [
      {
        id: "availability",
        title: {
          en: "Availability",
          ar: "التوفر",
        },
        type: "checkbox",
        options: [
          {
            label: {
              en: "In stock",
              ar: "متوفر",
            },
            value: "in_stock",
            count: inStock,
          },
          {
            label: {
              en: "Out of stock",
              ar: "غير متوفر",
            },
            value: "out_stock",
            count: outOfStock,
          },
        ],
      },
      {
        id: "Price",
        title: {
          en: "Price",
          ar: "السعر",
        },
        type: "range",
        subtitle: `The highest price is ${HigherP} ${currency}`,
        subtitleAr: `اعلى سعر هو ${HigherP} ${currency}`,
      },
      {
        id: "category",
        title: {
          en: "Category",
          ar: "المجموعة",
        },
        type: "checkbox",
        options: cleanOptions(categories),
      },
      {
        id: "type",
        title: {
          en: "Products Type",
          ar: "نوع المنتجات",
        },
        type: "checkbox",
        options: cleanOptions(dataType),
      },
      {
        id: "colors",
        title: {
          en: "Products Colors",
          ar: "الوان المنتجات",
        },
        type: "checkbox",
        options: cleanOptions(dataColors),
      },
      {
        id: "sizes",
        title: {
          en: "Products Sizes",
          ar: "حجم المنتجات",
        },
        type: "checkbox",
        options: cleanOptions(dataSizes),
      },
      {
        id: "quantity",
        title: {
          en: "Products Quantity",
          ar: "كمية المنتجات",
        },
        type: "checkbox",
        options: cleanOptions(dataQuantity),
      },
    ];
    return filters.filter((f) => {
      if (f.type === "range") return true;
      return f.options?.length > 0;
    });
  }, [
    inStock,
    outOfStock,
    HigherP,
    currency,
    categories,
    dataType,
    dataColors,
    dataSizes,
    dataQuantity,
  ]);
};
export default useFiltersConfig;
