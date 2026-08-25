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
  const s = await getTranslations("TrackOrderData");

  let data = null;
  let cards = [];

  if (order) {
    try {
      const endpoint = `orders?where[orderNumber][equals]=${encodeURIComponent(order)}`;
      const orderData = await GetDataServerSide(endpoint, "GET");
      data = orderData.docs[0];
      cards = [
        {
          title: s("orderNumber"),
          value: data.orderNumber,
          type: "text",
        },
        {
          title: s("totalAmount"),
          value: data.total,
          suffix: "USD",
          type: "money",
        },
        {
          title: s("shippingCost"),
          value: data.shipping?.price || 0,
          suffix: "USD",
          type: "money",
        },
        {
          title: s("shippingCountry"),
          value:
            locale === "en"
              ? data.shipping?.zone?.cityName
              : data.shipping?.zone?.cityNameAr,
          type: "text",
        },
      ];
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
            <TrackOrderData locale={locale} order={data} cards={cards} />
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
export async function generateMetadata({ params }) {
  const { locale } = await params;

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "متابعة الطلب" : "Track Orders",

    robots: {
      index: false,
      follow: false,
    },
  };
}
