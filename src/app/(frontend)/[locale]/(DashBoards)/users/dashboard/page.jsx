import React from "react";
import GetDataServerSide from "@/actions/GetDataServerSide";
import DashboardClient from "@/components/ui/Taps/DashboardTap/DashboardClient";
export default async function ({ params }) {
  const { locale } = await params;
  const orderData = await GetDataServerSide("orders?limit=0", "GET");

  return (
    <div className="relative">
      <DashboardClient locale={locale} data={orderData.docs} />
    </div>
  );
}
