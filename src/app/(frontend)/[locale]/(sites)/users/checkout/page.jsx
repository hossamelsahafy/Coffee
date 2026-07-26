import React from "react";
import CheckoutClient from "@/components/ui/CheckoutPage/CheckoutClient";
import GetAllData from "@/actions/GetAllData";
import { getTranslations } from "next-intl/server";
import GetDataServerSide from "@/actions/GetDataServerSide";

const page = async ({ params }) => {
  const { locale } = await params;
  const shippingData = await GetAllData("shipping-zones");
  const pendingOrders = await GetDataServerSide(
    "orders?where[payment.method][equals]=stripe&where[payment.status][equals]=pending",
    "GET",
  );
  const t = await getTranslations("Orders");
  const Subtotal = t("subtotal");
  const total = t("total");
  const ShippingCost = t("shippingCost");
  const ShowDetails = t("ShowDetails");
  const PayNow = t("PayNow");
  const Paid = t("Paid");
  const cash = t("cash");
  return (
    <>
      <CheckoutClient
        locale={locale}
        shippingData={shippingData}
        pendingOrders={pendingOrders}
        total={total}
        subtotal={Subtotal}
        shippingCost={ShippingCost}
        ShowDetails={ShowDetails}
        PayNow={PayNow}
        Paid={Paid}
        cash={cash}
      />
    </>
  );
};

export default page;
