import React from "react";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import { getTranslations } from "next-intl/server";
import SearchOrderCard from "@/components/ui/Taps/TrackOrderTap/SearchOrderCard";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import GetDataServerSide from "@/actions/GetDataServerSide";
import OrderTimeline from "@/components/ui/Taps/TrackOrderTap/OrderTimeline";
export default async function TrackOrderPage({ params, searchParams }) {
  const { locale } = await params;
  const { order } = await searchParams;

  const t = await getTranslations("TrackOrder");

  let data = null;

  if (order) {
    try {
      const endpoint = `orders?where[orderNumber][equals]=${encodeURIComponent(order)}`;
      const orderData = await GetDataServerSide(endpoint, "GET");
      data = orderData.docs[0];
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch order:", error.message);
    }
  }

  return (
    <div className="relative">
      <ContentLayout
        locale={locale}
        title={t("title")}
        subtitle={order ? t("subtitle2") : t("subtitle")}
        MyThing={t("MyAccount")}
        isdiff={true}
      >
        {order && data ? (
          <>
            <TrackOrderData locale={locale} order={data} />
            <OrderTimeline currentStatus={data.status} />
          </>
        ) : (
          <>
            <SearchOrderCard />
          </>
        )}
      </ContentLayout>
    </div>
  );
}
