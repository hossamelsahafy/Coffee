"use client";
import React from "react";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { useTranslations } from "next-intl";

const DashboardClient = ({ locale, data }) => {
  const t = useTranslations("DashboardData");

  const title = t("title");
  const subtitle = t("subtitle");
  const MyAccount = t("MyAccount");

  const chartData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];

    const map = {};

    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString().split("T")[0];
    };

    data.forEach((order) => {
      if (order.createdAt && order.status !== "cancelled") {
        const orderDate = formatDate(order.createdAt);
        if (orderDate) {
          if (!map[orderDate]) {
            map[orderDate] = { date: orderDate, spent: 0, orders: 0 };
          }
          map[orderDate].orders += 1;
        }
      }

      const isPaid = order.payment?.status === "paid";
      const paidDateStr = order.paidAt;

      if (isPaid && paidDateStr) {
        const paidDate = formatDate(paidDateStr);
        if (paidDate) {
          if (!map[paidDate]) {
            map[paidDate] = { date: paidDate, spent: 0, orders: 0 };
          }
          map[paidDate].spent += Number(order.total) || 0;
        }
      }
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);
  const cards = [
    {
      title: t("totalOrders"),
      value: data?.length || 0,
      type: "text",
    },
    {
      title: t("totalSpent"),
      value: data
        ?.filter((order) => order.payment?.status === "paid")
        .reduce((acc, order) => acc + Number(order.total || 0), 0)
        .toFixed(2),
      suffix: locale === "en" ? "USD" : "دولار",
      type: "money",
    },
    {
      title: t("cashOrders"),
      value:
        data?.filter((order) => order.payment?.method === "cash").length || 0,
      type: "text",
    },
    {
      title: t("stripeOrders"),
      value:
        data?.filter((order) => order.payment?.method === "stripe").length || 0,
      type: "text",
    },
  ];
  return (
    <ContentLayout
      locale={locale}
      title={title}
      subtitle={subtitle}
      MyThing={MyAccount}
      isdiff={true}
    >
      <div className="max-w-6xl flex flex-col gap-4">
        <TrackOrderData locale={locale} order={data} cards={cards} />

        <ChartAreaInteractive chartData={chartData} />
      </div>
    </ContentLayout>
  );
};

export default DashboardClient;
