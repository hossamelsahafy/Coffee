"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/Context/CartContext";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/components/ui/Taps/OrdersTap/OrdersCard";
import StripeModule from "@/components/ui/CheckoutPage/StripeModule";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ShowOrderDetailsModule from "@/components/shared/Model/ShowOrderDetailsModule";
import { useDashboard } from "@/Context/DashboardContext";
const Orders = ({
  data,
  locale,
  total,
  subtotal,
  shippingCost,
  ShowDetails,
  PayNow,
  Paid,
  cash,
}) => {
  const t = useTranslations("OrderStatus");
  const paymentT = useTranslations("PaymentStatus");
  const paymentM = useTranslations("PaymentMethod");
  const { cart, clearCart } = useCart();
  const searchParams = useSearchParams();
  const [stripeOrderId, setStripeOrderId] = useState("");
  const [stripeOpen, setStripeOpen] = useState(false);
  const isendPoint = true;
  const [toast, setToast] = useState({ message: null, type: "" });
  const [openModule, setOpenModule] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { openSidebar } = useDashboard();
  useEffect(() => {
    const fromPayment = searchParams.get("payment");
    if (
      fromPayment === "pending" ||
      fromPayment === "cash" ||
      fromPayment === "paid"
    ) {
      if (cart.length > 0) {
        clearCart();
      }
    }
  }, [searchParams, clearCart]);
  const breakpoints = {
    0: { slidesPerView: 1 },
    700: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
  };
  return (
    <>
      <div className="w-full mt-4 ">
        <GridSwiper
          filteredProducts={data}
          loop={false}
          enablePagePagination
          breakpoints={breakpoints}
          sideBarIsOpen={openSidebar}
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
                openModule={openModule}
                setOpenModule={setOpenModule}
                paymentT={paymentT}
                paymentM={paymentM}
                setStripeOrderId={setStripeOrderId}
                setStripeOpen={setStripeOpen}
                cash={cash}
                setSelectedData={setSelectedData}
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
              isEndPoint={isendPoint}
              setToast={setToast}
            />
          </div>
        </div>
      )}
      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
      <ShowOrderDetailsModule
        open={openModule}
        onClose={() => setOpenModule(false)}
        order={selectedData}
      />
    </>
  );
};

export default Orders;
