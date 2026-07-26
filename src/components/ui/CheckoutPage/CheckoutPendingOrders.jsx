"use client";
import React, { useState } from "react";
import OrderCard from "@/components/ui/Taps/OrdersTap/OrdersCard";
import { useTranslations } from "next-intl";
import StripeModule from "./StripeModule";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import NoItemsYet from "./NoItemsYet";

const CheckoutPendingOrders = ({
  locale,
  total,
  subtotal,
  ShowDetails,
  PayNow,
  Paid,
  cash,
  pendingOrders,
  shippingCost,
}) => {
  const t = useTranslations("OrderStatus");
  const paymentT = useTranslations("PaymentStatus");
  const paymentM = useTranslations("PaymentMethod");
  const [stripeOrderId, setStripeOrderId] = useState();
  const [stripeOpen, setStripeOpen] = useState();
  const breakpoints = {
    0: { slidesPerView: 1 },
    700: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-4 ">
        <NoItemsYet
          text="Complete Your Pending Orders"
          textAr="أكمل طلباتك المعلقة"
          locale={locale}
        />
        <GridSwiper
          filteredProducts={pendingOrders.docs}
          loop={false}
          enablePagePagination
          breakpoints={breakpoints}
          PaddingBottom="20px"
          renderItem={(d) => {
            const order = d;
            return (
              <OrderCard
                key={order.id}
                d={order}
                locale={locale}
                total={total}
                subtotal={subtotal}
                shippingCost={shippingCost}
                ShowDetails={ShowDetails}
                PayNow={PayNow}
                Paid={Paid}
                t={t}
                paymentT={paymentT}
                paymentM={paymentM}
                setStripeOrderId={setStripeOrderId}
                setStripeOpen={setStripeOpen}
                cash={cash}
              />
            );
          }}
        />
      </div>
      {stripeOpen && stripeOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col justify-center items-center">
            <StripeModule
              orderId={stripeOrderId}
              locale={locale}
              setStripeOpen={setStripeOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPendingOrders;
