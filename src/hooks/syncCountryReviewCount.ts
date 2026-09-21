import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

const getCountryId = (country: any) => {
  if (!country) return null;

  return typeof country === "object" ? country.id : country;
};

const updateCountryReviewCount = async (
  req: any,
  countryId: string,
  change: number,
) => {
  if (!countryId || change === 0) return;

  const country = await req.payload.findByID({
    collection: "countries",
    id: countryId,
  });

  if (!country) return;

  const currentCount = Number(country.reviewCount || 0);

  await req.payload.update({
    collection: "countries",
    id: countryId,
    data: {
      reviewCount: Math.max(0, currentCount + change),
    },
  });
};

export const syncCountryReviewCount: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  try {
    const newCountryId = getCountryId(doc.country);
    const oldCountryId = previousDoc ? getCountryId(previousDoc.country) : null;

    const isApproved = doc.isApproved === true;
    const wasApproved = previousDoc?.isApproved === true;

    if (operation === "create") {
      if (isApproved && newCountryId) {
        await updateCountryReviewCount(req, newCountryId, 1);
      }

      return doc;
    }

    if (!wasApproved && isApproved) {
      if (newCountryId) {
        await updateCountryReviewCount(req, newCountryId, 1);
      }

      return doc;
    }

    if (wasApproved && !isApproved) {
      if (oldCountryId) {
        await updateCountryReviewCount(req, oldCountryId, -1);
      }

      return doc;
    }

    if (isApproved && oldCountryId !== newCountryId) {
      if (oldCountryId) {
        await updateCountryReviewCount(req, oldCountryId, -1);
      }

      if (newCountryId) {
        await updateCountryReviewCount(req, newCountryId, 1);
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
      const countryId = getCountryId(doc.country);

      if (doc.isApproved === true && countryId) {
        await updateCountryReviewCount(req, countryId, -1);
      }
    } catch (error) {
      console.error("Error syncing country count after delete:", error);
    }

    return doc;
  };
