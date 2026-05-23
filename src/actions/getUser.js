import { cookies } from "next/headers";

export const getUser = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("payload-token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data.user;
  } catch {
    return null;
  }
};
