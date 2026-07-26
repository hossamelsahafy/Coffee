import { cookies } from "next/headers";

export default async function GetDataServerSide(slug, method, formData) {
  const url = process.env.NEXT_PUBLIC_URL;

  const cookieStore = await cookies();

  try {
    const res = await fetch(`${url}/api/${slug}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: method !== "GET" ? JSON.stringify(formData) : undefined,
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
