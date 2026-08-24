export default async function SlugMethods(slug, method, formData) {
  const url = process.env.NEXT_PUBLIC_URL;

  try {
    const options = {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (formData && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(formData);
    }

    const res = await fetch(`${url}/api/${slug}`, options);
    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;
  } catch (err) {
    throw err;
  }
}
