"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import LoadingSpiner from "@/components/shared/Spiner/LoadingSpiner";
type CheckoutFormProps = {
  locale?: "en" | "ar";
  setStripeOpen: (value: boolean) => void;
};

export default function CheckoutForm({
  locale = "en",
  setStripeOpen,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/users/payment-success`,
      },
    });

    if (error) {
      setError(error.message || "Payment failed");
    }

    setLoading(false);
  };
  const handleCancelPayment = () => {
    setCancelLoading(true);

    setCancelMessage(
      locale === "en"
        ? "You will be redirected to your orders page. You can complete your payment later."
        : "سيتم تحويلك إلى صفحة الطلبات. يمكنك إكمال الدفع لاحقًا.",
    );

    setTimeout(() => {
      setStripeOpen(false);
      router.push("/users/orders?payment=pending");
    }, 10000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full  p-4 sm:p-6">
      <PaymentElement />

      {error && (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 mt-4 text-center text-sm text-amber-200">
          {error}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-1/2 rounded-full bg-base-coffe py-3 text-white mt-4 flex items-center justify-center"
        >
          {loading ? (
            <>
              {locale === "en" ? "Processing..." : "يتم المعالجة..."}
              <LoadingSpiner customBorder={""} />
            </>
          ) : locale === "en" ? (
            "Pay Now"
          ) : (
            "ادفع الان"
          )}
        </button>
        <button
          type="button"
          onClick={handleCancelPayment}
          disabled={cancelLoading}
          className="w-1/2 rounded-full bg-base-coffe py-3 text-white mt-4 flex items-center justify-center"
        >
          {cancelLoading ? (
            <>
              {locale === "en" ? "Redirecting..." : "جاري التحويل..."}
              <LoadingSpiner customBorder={""} />
            </>
          ) : locale === "en" ? (
            "Cancel payment"
          ) : (
            "إلغاء الدفع"
          )}
        </button>
      </div>
      {cancelMessage && (
        <div className="rounded-xl border border-base-coffe/20 bg-base-coffe/10 p-3 mt-4 text-center text-sm text-base-light">
          {cancelMessage}
        </div>
      )}
    </form>
  );
}
