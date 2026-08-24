"use client";

import { useEffect, useState, useRef } from "react";
import StripeElements from "@/lib/StripeElements";
import CheckoutForm from "./CheckoutForm";
import LoadingSpiner from "@/components/shared/Spiner/LoadingSpiner";
import SlugMethods from "@/actions/SlugMethods";

export default function StripeModule({
  orderId,
  locale,
  setStripeOpen,
  isEndPoint,
  setToast,
}) {
  const [clientSecret, setClientSecret] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (!orderId || calledRef.current) return;
    calledRef.current = true;

    const createPaymentIntent = async () => {
      try {
        const data = await SlugMethods("payments/stripe", "POST", { orderId });

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
          sessionStorage.setItem("active_checkout_order_id", orderId);
          sessionStorage.setItem("is_checkout_active", "true");
        }
      } catch (err) {
        setToast({
          message:
            locale === "en"
              ? "Failed to initialize payment."
              : "فشل تهيئة الدفع.",
          type: "error",
        });
      }
    };

    createPaymentIntent();
  }, [orderId, locale, setToast]);

  if (!clientSecret) {
    return (
      <div className="flex text-center items-center">
        <p>
          {locale === "en"
            ? "Loading Payment Form..."
            : "يتم تحميل قائمة الدفع"}
          <LoadingSpiner />
        </p>
      </div>
    );
  }

  return (
    <StripeElements clientSecret={clientSecret}>
      <CheckoutForm
        locale={locale}
        setStripeOpen={setStripeOpen}
        orderID={orderId}
        isEndPoint={isEndPoint}
        clientSecret={clientSecret}
        setToast={setToast}
      />
    </StripeElements>
  );
}
