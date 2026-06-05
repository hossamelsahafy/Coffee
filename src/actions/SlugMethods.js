export default async function SlugMethods(slug, method, formData) {
  const url = process.env.NEXT_PUBLIC_URL;

  try {
    const res = await fetch(`${url}/api/${slug}`, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;
  } catch (err) {
    throw new Error(err?.message || "Network error");
  }
}
