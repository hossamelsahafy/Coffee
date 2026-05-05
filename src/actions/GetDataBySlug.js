export default async function GetDataBySlug(slug, slugName, locale) {
  try {
    const url = process.env.NEXT_PUBLIC_URL;

    const decodedSlug = decodeURIComponent(slugName);
    const encodedSlug = encodeURIComponent(decodedSlug);

    const field = locale === "ar" ? "slugAr" : "slug";

    const res = await fetch(
      `${url}/api/${slug}?where[${field}][equals]=${encodedSlug}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    return data.docs[0];
  } catch (error) {
    console.error("GetAllData error:", error);
    return null;
  }
}
