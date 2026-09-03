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
  setStripeOpen: (reason: "success" | "cancel") => void;
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
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const handlePaymentSuccess = () => {
    setToast({
      type: "success",
      message:
        locale === "en"
          ? "Payment completed successfully."
          : "تم إتمام عملية الدفع بنجاح.",
    });
    if (isEndPoint) {
      setStripeOpen("success");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEndPoint) {
        const result = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });

        const { paymentIntent, error: stripeError } = result;

        if (stripeError) {
          setToast({
            type: "error",
            message:
              stripeError.message ||
              (locale === "en"
                ? "Payment failed. Please try another card."
                : "فشلت عملية الدفع. يرجى تجربة بطاقة أخرى."),
          });

          return;
        }

        if (paymentIntent?.status === "succeeded") {
          handlePaymentSuccess();
          return;
        }

        setError(
          locale === "en"
            ? `Payment status: ${paymentIntent?.status || "unknown"}`
            : `حالة الدفع: ${paymentIntent?.status || "غير معروفة"}`,
        );

        return;
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/users/payment-success?orderId=${encodeURIComponent(
            orderID,
          )}`,
        },
      });

      if (stripeError) {
        setError(
          stripeError.message ||
            (locale === "en" ? "Payment failed." : "فشلت عملية الدفع."),
        );
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);

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
    if (cancelLoading || loading) return;

    setCancelLoading(true);

    if (!isEndPoint) {
      setCancelMessage(
        locale === "en"
          ? "You will be redirected to your orders page. You can complete your payment later."
          : "سيتم تحويلك إلى صفحة الطلبات. يمكنك إكمال عملية الدفع لاحقًا.",
      );

      setTimeout(() => {
        if (isEndPoint) {
          setStripeOpen("cancel");
        }

        router.push("/users/dashboard/orders?payment=pending");
      }, 5000);

      return;
    }

    setToast({
      type: "warning",
      message:
        locale === "en"
          ? "Payment was cancelled. You can complete it later."
          : "تم إلغاء عملية الدفع. يمكنك إكمالها لاحقًا.",
    });
    if (isEndPoint) {
      setStripeOpen("cancel");
    }

    setCancelLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 sm:p-6">
      <PaymentElement />

      {error && (
        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-center text-sm text-amber-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="mt-4 flex w-1/2 items-center justify-center rounded-full bg-base-coffe py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              {locale === "en" ? "Processing..." : "يتم المعالجة..."}
              <LoadingSpiner customBorder="" />
            </>
          ) : locale === "en" ? (
            "Pay Now"
          ) : (
            "ادفع الآن"
          )}
        </button>

        <button
          type="button"
          onClick={handleCancelPayment}
          disabled={cancelLoading || loading}
          className="mt-4 flex w-1/2 items-center justify-center rounded-full bg-base-coffe py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelLoading ? (
            <>
              {locale === "en" ? "Redirecting..." : "جاري التحويل..."}
              <LoadingSpiner customBorder="" />
            </>
          ) : locale === "en" ? (
            "Cancel payment"
          ) : (
            "إلغاء الدفع"
          )}
        </button>
      </div>

      {cancelMessage && (
        <div className="mt-4 rounded-xl border border-base-coffe/20 bg-base-coffe/10 p-3 text-center text-sm text-base-light">
          {cancelMessage}
        </div>
      )}
    </form>
  );
}
