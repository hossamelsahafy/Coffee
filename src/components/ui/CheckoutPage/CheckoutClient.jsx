"use client";

import React, { useState } from "react";
import CheckoutDetails from "./CheckoutDetails";
import { useCart } from "@/Context/CartContext";
import NoItemsYet from "./NoItemsYet";
import CheckoutPendingOrders from "./CheckoutPendingOrders";
import PendingChoice from "./PendingChoice";
const CheckoutClient = ({
  locale,
  shippingData,
  pendingOrders,
  total,
  subtotal,
  shippingCost,
  ShowDetails,
  PayNow,
  Paid,
  cash,
}) => {
  const { cart } = useCart();
  const [checkoutMode, setCheckoutMode] = useState(null);

  const hasPendingOrders = pendingOrders?.docs?.length > 0;
  if (hasPendingOrders && checkoutMode === null) {
    return (
      <div className="mt-24 w-full border-t border-base-border">
        <PendingChoice
          locale={locale}
          pendingCount={pendingOrders?.docs?.length || 0}
          onContinuePayment={() => setCheckoutMode("pending")}
          onCreateOrder={() => setCheckoutMode("new")}
        />
      </div>
    );
  }

  return (
    <div className="mt-24 w-full border-t border-base-border">
      {checkoutMode === "pending" && hasPendingOrders && (
        <CheckoutPendingOrders
          total={total}
          subtotal={subtotal}
          shippingCost={shippingCost}
          ShowDetails={ShowDetails}
          PayNow={PayNow}
          Paid={Paid}
          cash={cash}
          pendingOrders={pendingOrders}
          locale={locale}
        />
      )}

      {(!hasPendingOrders || checkoutMode === "new") &&
        (cart.length > 0 ? (
          <CheckoutDetails locale={locale} shippingData={shippingData} />
        ) : (
          <NoItemsYet
            locale={locale}
            text={"No Items Was Added To Cart Yet"}
            textAr={"لم يتم اضافة عناصر لعربة التسوق بعد"}
          />
        ))}
    </div>
  );
};

export default CheckoutClient;
