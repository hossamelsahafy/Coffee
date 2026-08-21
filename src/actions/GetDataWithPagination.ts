"use server";
export default async function GetDataWithPagination(
  collection: string,
  page: number = 1,
  limit: number = 9,
  sort: string = "",
  where: Record<string, any> = {},
) {
  try {
    const url = process.env.NEXT_PUBLIC_URL;
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (sort) {
      query.append("sort", sort);
    }

    const appendWhereParams = (obj, prefix = "where") => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const paramKey = `${prefix}[${key}]`;

          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            appendWhereParams(value, paramKey);
          } else if (value !== undefined) {
            query.append(paramKey, String(value));
          }
        }
      }
    };

    if (where && Object.keys(where).length > 0) {
      appendWhereParams(where);
    }

    const res = await fetch(`${url}/api/${collection}?${query.toString()}`, {
      next: { revalidate: 60 },
    });

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
    console.error("GetDataWithPagination error:", error);
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
