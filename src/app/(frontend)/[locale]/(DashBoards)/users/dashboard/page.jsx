import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/getUser";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
export default async function ({ params }) {
  const { locale } = await params;

  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/users/login`);
  }
  return (
    <div className="relative">
      <ContentLayout locale={locale} user={user} />
    </div>
  );
}
