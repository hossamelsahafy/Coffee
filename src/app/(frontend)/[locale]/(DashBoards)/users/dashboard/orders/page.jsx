import React from "react";
import Orders from "@/components/ui/OrderPage/Orders";
import GetDataServerSide from "@/actions/GetDataServerSide";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import { getTranslations } from "next-intl/server";
export default async function Page({ params }) {
  const { locale } = await params;
  const data = await GetDataServerSide("orders?limit=100", "GET");
  const t = await getTranslations("Orders");
  const title = t("title");
  const subtitle = t("subtitle");
  const MyThing = t("MyAccount");
  const Subtotal = t("subtotal");
  const total = t("total");
  const ShippingCost = t("shippingCost");
  const ShowDetails = t("ShowDetails");
  const PayNow = t("PayNow");
  const Paid = t("Paid");
  const cash = t("cash");
  return (
    <div className="relative">
      <ContentLayout
        locale={locale}
        title={title}
        subtitle={subtitle}
        MyThing={MyThing}
        isdiff={true}
      >
        <Orders
          data={data.docs}
          locale={locale}
          total={total}
          subtotal={Subtotal}
          shippingCost={ShippingCost}
          ShowDetails={ShowDetails}
          PayNow={PayNow}
          Paid={Paid}
          cash={cash}
        />
      </ContentLayout>
    </div>
  );
}
