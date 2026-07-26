"use client";

import { Coffee, CreditCard, ShoppingBag } from "lucide-react";

const PendingOrdersChoice = ({
  locale,
  pendingCount,
  onContinuePayment,
  onCreateOrder,
}) => {
  const isArabic = locale === "ar";

  return (
    <div className="flex w-full justify-center py-12 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-base-border bg-base-secondary/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="relative border-b border-base-border px-8 py-8">
          <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-600/10 border border-amber-600/20">
              <Coffee className="h-10 w-10 text-amber-600" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-base-text">
                {isArabic ? "لديك طلبات معلقة" : "Pending Coffee Orders"}
              </h2>

              <p className="mt-3 text-base-muted max-w-lg">
                {isArabic
                  ? `لديك ${pendingCount} طلب ${
                      pendingCount > 1 ? "طلبات" : ""
                    } لم يتم دفعها بعد. يمكنك إكمال الدفع أو إنشاء طلب جديد.`
                  : `You currently have ${pendingCount} unpaid order${
                      pendingCount > 1 ? "s" : ""
                    }. Would you like to continue paying for them or create a new order?`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-8 md:grid-cols-2">
          <button
            onClick={onContinuePayment}
            className="group rounded-2xl border border-amber-600/30 bg-amber-500/10 p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:bg-amber-500/20"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-600 text-white">
              <CreditCard size={26} />
            </div>

            <h3 className="text-xl font-semibold text-base-text">
              {isArabic ? "متابعة الدفع" : "Continue Payment"}
            </h3>

            <p className="mt-2 text-sm text-base-muted">
              {isArabic
                ? "أكمل عملية الدفع للطلبات المعلقة."
                : "Finish paying for your pending orders."}
            </p>
          </button>

          <button
            onClick={onCreateOrder}
            className="group rounded-2xl border border-base-border bg-base-primary p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:border-amber-500"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-base-nav">
              <ShoppingBag size={26} className="text-amber-600" />
            </div>

            <h3 className="text-xl font-semibold text-base-text">
              {isArabic ? "إنشاء طلب جديد" : "Create New Order"}
            </h3>

            <p className="mt-2 text-sm text-base-muted">
              {isArabic
                ? "ابدأ طلبًا جديدًا واختر منتجاتك المفضلة."
                : "Start a fresh coffee order with your favorite drinks."}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersChoice;
