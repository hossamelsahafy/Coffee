"use client";

import { FormEvent, useEffect, useState } from "react";
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
  isEndPoint: boolean;
  orderID: string;
  clientSecret: string;
  clearCart?: () => void;
  setToast: React.Dispatch<
    React.SetStateAction<{
      message: string | null;
      type: "success" | "error" | "warning" | "";
    }>
  >;
};

export default function CheckoutForm({
  locale = "en",
  setStripeOpen,
  isEndPoint,
  setToast,
  orderID,
  clientSecret,
  clearCart,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();
  console.log(orderID);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    await fetch(`/api/auth/order/${orderID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId }),
    });

    setToast({
      type: "success",
      message:
        locale === "en"
          ? "Payment completed successfully."
          : "تم إتمام عملية الدفع بنجاح.",
    });

    setStripeOpen(false);
    router.refresh();
  };

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent && paymentIntent.status === "succeeded") {
        handlePaymentSuccess(paymentIntent.id);
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      if (isEndPoint) {
        const { paymentIntent, error: stripeError } =
          await stripe.confirmPayment({
            elements,
            redirect: "if_required",
          });

        if (stripeError) {
          setToast({
            type: "error",
            message:
              locale === "en"
                ? stripeError.message ||
                  "Payment failed. Please try another card."
                : "فشلت عملية الدفع. يرجى تجربة بطاقة أخرى.",
          });
          setLoading(false);
          return;
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
          await handlePaymentSuccess(paymentIntent.id);
        }
      } else {
        if (clearCart) clearCart();

        const { error: stripeError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/users/payment-success`,
          },
        });

        if (stripeError) {
          setError(stripeError.message || "Payment failed");
        }
      }
    } catch (err) {
      setError(
        locale === "en"
          ? "An unexpected error occurred."
          : "حدث خطأ غير متوقع.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = () => {
    setCancelLoading(true);
    if (!isEndPoint) {
      setCancelMessage(
        locale === "en"
          ? "You will be redirected to your orders page. You can complete your payment later."
          : "سيتم تحويلك إلى صفحة الطلبات. يمكنك إكمال الدفع لاحقًا.",
      );
      setTimeout(() => {
        setStripeOpen(false);
        router.push("/users/dashboard/orders?payment=pending");
      }, 2000);
    } else {
      setToast({
        type: "warning",
        message:
          locale === "en"
            ? "Payment was cancelled. You can complete it later."
            : "تم إلغاء عملية الدفع. يمكنك إكمالها لاحقًا.",
      });

      setStripeOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 sm:p-6">
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
