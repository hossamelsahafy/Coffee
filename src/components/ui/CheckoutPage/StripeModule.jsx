"use client";

import { useEffect, useState, useRef } from "react";
import StripeElements from "@/lib/StripeElements";
import CheckoutForm from "./CheckoutForm";
import LoadingSpiner from "@/components/shared/Spiner/LoadingSpiner";

export default function StripeModule({ orderId, locale, setStripeOpen }) {
  const [clientSecret, setClientSecret] = useState("");

  const calledRef = useRef(false);

  useEffect(() => {
    if (!orderId || calledRef.current) return;

    calledRef.current = true;

    const createPaymentIntent = async () => {
      const res = await fetch("/api/payments/stripe", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, [orderId]);

  if (!clientSecret) {
    return (
      <div className="flex text-center items-center ">
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
      />
    </StripeElements>
  );
}
