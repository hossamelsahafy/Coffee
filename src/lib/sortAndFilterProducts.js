export const HigherPrice = (products) =>
  Math.max(
    ...products.map((item) =>
      Math.max(...(item.choices?.options?.map((o) => o.priceAfter) || [0])),
    ),
  );
export const getPrice = (item) =>
  Math.max(...(item.choices?.options?.map((o) => o.priceAfter) || [0]));

export const sortByPriceLowHigh = (list) =>
  [...list].sort((a, b) => getPrice(a) - getPrice(b));

export const sortByPriceHighLow = (list) =>
  [...list].sort((a, b) => getPrice(b) - getPrice(a));

export const sortAZ = (list, lang = "en") =>
  [...list].sort((a, b) =>
    lang === "ar"
      ? a.titleAr.localeCompare(b.titleAr, "ar")
      : a.title.localeCompare(b.title),
  );

export const sortZA = (list, lang = "en") =>
  [...list].sort((a, b) =>
    lang === "ar"
      ? b.titleAr.localeCompare(a.titleAr, "ar")
      : b.title.localeCompare(a.title),
  );

export const sortByBestSelling = (list) =>
  [...list].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));

export const getSortedData = (data, sortType, locale) => {
  switch (sortType) {
    case "price_low_high":
      return sortByPriceLowHigh(data);

    case "price_high_low":
      return sortByPriceHighLow(data);

    case "a_z":
      return sortAZ(data, locale);

    case "z_a":
      return sortZA(data, locale);

    case "best_selling":
    default:
      return sortByBestSelling(data);
  }
};

export const getStockCounts = (data) => {
  return data.reduce(
    (acc, product) => {
      const options = product.choices?.options || [];

      options.forEach((o) => {
        if (o.availability === "inStock") {
          acc.inStock += 1;
        } else {
          acc.outOfStock += 1;
        }
      });

      return acc;
    },
    { inStock: 0, outOfStock: 0 },
  );
};

export const getCategories = (data = []) =>
  Object.values(
    data.reduce((acc, product) => {
      const cat = product.category;

      if (!cat?.title) return acc;

      const key = cat.title;

      if (!acc[key]) {
        acc[key] = {
          value: cat.title,
          label: {
            en: cat.title,
            ar: cat.titleAr,
          },
          count: 0,
        };
      }

      acc[key].count += 1;

      return acc;
    }, {}),
  );

export const getProductsType = (data) =>
  Object.values(
    data.reduce((acc, pro) => {
      const type = pro.type;
      if (!type) return acc;
      if (!acc[type]) {
        acc[type] = {
          value: pro.type,
          label: {
            en: pro.type,
            ar: pro.typeAr,
          },
          count: 0,
        };
      }
      acc[type].count += 1;
      return acc;
    }, {}),
  );

export const getProductsOptions = (data = [], type) =>
  Object.values(
    data.reduce((acc, pro) => {
      const choices = pro.choices;

      if (!choices || choices.choiceType !== type) {
        return acc;
      }

      choices.options?.forEach((o) => {
        const key = o.value;
        if (!key) return;

        if (!acc[key]) {
          acc[key] = {
            value: key,
            label: {
              en: o.value,
              ar: o.valueAr,
            },
            count: 0,
          };
        }

        acc[key].count += 1;
      });

      return acc;
    }, {}),
  );
