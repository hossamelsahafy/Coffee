import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

export const syncCountryReviewCount: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  try {
    const newCountryId =
      typeof doc.country === "object" ? doc.country?.id : doc.country;
    const oldCountryId = previousDoc
      ? typeof previousDoc.country === "object"
        ? previousDoc.country?.id
        : previousDoc.country
      : null;

    if (operation === "update" && oldCountryId !== newCountryId) {
      if (oldCountryId) {
        const oldCountry = await req.payload.findByID({
          collection: "countries",
          id: oldCountryId,
        });
        if (oldCountry) {
          const currentCount = Number(oldCountry.reviewCount || 0);
          await req.payload.update({
            collection: "countries",
            id: oldCountryId,
            data: {
              reviewCount: Math.max(0, currentCount - 1),
            },
          });
        }
      }

      if (newCountryId) {
        const newCountry = await req.payload.findByID({
          collection: "countries",
          id: newCountryId,
        });
        if (newCountry) {
          const currentCount = Number(newCountry.reviewCount || 0);
          await req.payload.update({
            collection: "countries",
            id: newCountryId,
            data: {
              reviewCount: currentCount + 1,
            },
          });
        }
      }
    } else if (operation === "create" && newCountryId) {
      const country = await req.payload.findByID({
        collection: "countries",
        id: newCountryId,
      });
      if (country) {
        const currentCount = Number(country.reviewCount || 0);
        await req.payload.update({
          collection: "countries",
          id: newCountryId,
          data: {
            reviewCount: currentCount + 1,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error syncing country review count:", error);
  }

  return doc;
};

export const syncCountryReviewCountAfterDelete: CollectionAfterDeleteHook =
  async ({ doc, req }) => {
    try {
      const countryId =
        typeof doc.country === "object" ? doc.country?.id : doc.country;
      if (countryId) {
        const country = await req.payload.findByID({
          collection: "countries",
          id: countryId,
        });
        if (country) {
          const currentCount = Number(country.reviewCount || 0);
          await req.payload.update({
            collection: "countries",
            id: countryId,
            data: {
              reviewCount: Math.max(0, currentCount - 1),
            },
          });
        }
      }
    } catch (error) {
      console.error("Error syncing country count after delete:", error);
    }

    return doc;
  };
