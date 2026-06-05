import React from "react";
import CartPageHeader from "@/components/ui/CartPage/CartPageHeader";
import CartData from "@/components/ui/CartPage/CartDetails";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/getUser";
const page = async ({ params }) => {
  const { locale } = await params;

  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/users/login`);
  }
  return (
    <div className="mt-24 w-full border-t border-base-border">
      <CartPageHeader />
      <CartData locale={locale} />
    </div>
  );
};

export default page;
