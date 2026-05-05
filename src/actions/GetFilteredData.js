export default async function GetFilteredData({
  collection,
  filterKey,
  slugName,
}) {
  try {
    const url = process.env.NEXT_PUBLIC_URL;

    const query = new URLSearchParams({
      [`where[${filterKey}][equals]`]: "true",
      "where[slug][not_equals]": slugName,
    });

    const res = await fetch(`${url}/api/${collection}?${query.toString()}`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error("GetFilteredData error:", error);
    return [];
  }
}
