export default async function GetAllData(slug, IsGlobale) {
  try {
    const url = process.env.NEXT_PUBLIC_URL;

    const res = await fetch(`${url}/api/${slug}?pagination=false&depth=1`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    if (!IsGlobale) {
      return data.docs;
    } else {
      return data;
    }
  } catch (error) {
    console.error("GetAllData error:", error);
    return null;
  }
}
