export default async function auth(data, endpoint, options = {}) {
  const url = process.env.NEXT_PUBLIC_URL;

  const res = await fetch(`${url}/api/${endpoint}`, {
    method: "POST",
    headers: options.includeHeaders
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
}
