import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/getUser";
const page = async ({ params }) => {
  const { locale } = await params;

  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/users/login`);
  }
  return <div>page</div>;
};

export default page;
