export default async function auth(data, endpoint, options = {}) {
  const res = await fetch(`/api/${endpoint}`, {
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
