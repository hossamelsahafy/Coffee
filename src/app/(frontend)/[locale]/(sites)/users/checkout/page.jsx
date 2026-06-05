import React from "react";
import CheckoutDetails from "@/components/ui/CheckoutPage/CheckoutDetails";
import GetAllData from "@/actions/GetAllData";
const page = async ({ params }) => {
  const { locale } = await params;
  const shippingData = await GetAllData("shipping-zones");
  return (
    <div className="mt-24 w-full border-t border-base-border">
      <CheckoutDetails locale={locale} shippingData={shippingData} />
    </div>
  );
};

export default page;
