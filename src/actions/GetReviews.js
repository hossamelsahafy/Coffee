"use server";

import GetFilteredData from "@/actions/GetFilteredData";

const GetReviews = async ({ countryId, page = 1, limit = 2 }) => {
  return GetFilteredData({
    collection: "reviews",
    page,
    limit,
    depth: 2,
    filters: [
      {
        key: "country",
        value: countryId,
        operator: "equals",
      },
      {
        key: "isApproved",
        value: true,
        operator: "equals",
      },
    ],
  });
};

export default GetReviews;
