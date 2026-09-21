import React from "react";
import GetDataServerSide from "@/actions/GetDataServerSide";
import DashboardClient from "@/components/ui/Taps/DashboardTap/DashboardClient";
import { getUser } from "@/actions/getUser";

export default async function ({ params }) {
  const { locale } = await params;

  const user = await getUser();

  const currency = user?.SelectedCurrency?.trim().toUpperCase();

  const orderData = await GetDataServerSide(
    `auth/order/analytics?currency=${encodeURIComponent(currency)}&locale=${locale}`,
    "GET",
  );

  const MostViwedProducts = await GetDataServerSide(
    "product-views?sort=-views&limit=3",
    "GET",
  );

  return (
    <div className="relative">
      <DashboardClient
        locale={locale}
        data={orderData}
        MostViwedProducts={MostViwedProducts.docs}
      />
    </div>
  );
}
