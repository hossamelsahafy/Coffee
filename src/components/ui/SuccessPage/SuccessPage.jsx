"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
export default function PaymentSuccessPage({ locale }) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/users/orders?payment=paid");
    }, 10000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="bg-base-coffe/10 border border-base-border rounded-2xl p-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <CheckCircle2 className="w-8 h-8 text-base-coffe" />

        <h1 className="text-center text-2xl font-bold text-base-light">
          {locale === "en"
            ? "Payment Completed Successfully"
            : "تم إتمام الدفع بنجاح"}
        </h1>
      </div>

      <p className="text-center text-base-lighter mb-6">
        {locale === "en"
          ? "Thank you for your purchase. Your order has been confirmed and your payment was received successfully."
          : "شكرًا لك على إتمام عملية الشراء. تم تأكيد طلبك واستلام عملية الدفع بنجاح."}
      </p>

      <div className="rounded-xl border border-base-coffe/20 bg-base-coffe/5 p-4 text-center">
        <p className="text-base-light font-medium">
          {locale === "en"
            ? "Redirecting to your orders dashboard..."
            : "جاري التحويل إلى صفحة الطلبات..."}
        </p>

        <p className="text-sm text-base-lighter mt-1">
          {locale === "en"
            ? "You can track your order status and view payment details there."
            : "يمكنك متابعة حالة طلبك وعرض تفاصيل الدفع من هناك."}
        </p>
      </div>
    </div>
  );
}
