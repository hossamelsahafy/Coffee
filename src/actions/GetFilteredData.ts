"use server";

import { cookies } from "next/headers";

interface FilterItem {
  key: string;
  value: any;
  operator?: string;
}

interface GetFilteredDataParams {
  collection: string;
  filterKey?: string;
  filterValue?: any;
  filters?: FilterItem[];
  operator?: string;
  slugName?: string | null;
  page?: number;
  limit?: number;
  sort?: string;
  depth?: number;
  useCookies?: boolean;
}

export default async function GetFilteredData({
  collection,
  filterKey,
  filterValue,
  filters = [],
  operator = "equals",
  slugName = null,
  page = 1,
  limit = 9,
  sort = "-createdAt",
  depth = 1,
  useCookies = false,
}: GetFilteredDataParams) {
  try {
    const url = process.env.NEXT_PUBLIC_URL;

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      depth: String(depth),
    });

    if (
      filterKey !== undefined &&
      filterKey !== null &&
      filterValue !== undefined
    ) {
      query.append(`where[${filterKey}][${operator}]`, String(filterValue));
    }

    if (filters.length > 0) {
      filters.forEach((filter, index) => {
        const op = filter.operator || "equals";

        query.append(
          `where[and][${index}][${filter.key}][${op}]`,
          String(filter.value),
        );
      });
    }

    if (sort) {
      query.append("sort", sort);
    }

    if (slugName) {
      query.append("where[slug][not_equals]", slugName);
    }

    const fetchOptions: RequestInit = {};

    if (useCookies) {
      const cookieStore = await cookies();

      fetchOptions.headers = {
        Cookie: cookieStore.toString(),
      };

      fetchOptions.cache = "no-store";
    } else {
      fetchOptions.next = {
        revalidate: 60,
      };
    }

    const requestUrl = `${url}/api/${collection}?${query.toString()}`;

    const res = await fetch(requestUrl, fetchOptions);

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      docs: data.docs || [],
      totalPages: data.totalPages || 1,
      page: data.page || 1,
      totalDocs: data.totalDocs || 0,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false,
    };
  } catch (error) {
    console.error("GetFilteredData error:", error);

    return {
      docs: [],
      totalPages: 1,
      page: 1,
      totalDocs: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}
