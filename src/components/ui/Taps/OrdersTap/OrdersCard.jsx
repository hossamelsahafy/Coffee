"use client";
import { useState } from "react";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/OrderStatus";
import Image from "next/image";
import LoadingSpiner from "@/components/shared/Spiner/LoadingSpiner";
const OrderCard = ({
  d,
  locale,
  total,
  subtotal,
  shippingCost,
  ShowDetails,
  PayNow,
  Paid,
  t,
  paymentT,
  paymentM,
  setStripeOrderId,
  setStripeOpen,
  setOpenModule,
  setSelectedData,
  setToast,
  cash,
  isUpdating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const status = ORDER_STATUS[d.status];
  const Icon = status.icon;
  const payment = PAYMENT_STATUS[d.payment.status];
  const PaymentIcon = payment.icon;
  const totalItems = d.items?.length || 0;
  const visibleCount = 4;
  const extraCount = totalItems - visibleCount;
  const handlePayment = () => {
    setLoading(true);
    setStripeOrderId(d.id);
    setStripeOpen(true);
  };

  return (
    <div className="flex flex-col w-full h-full justify-between gap-4 rounded-2xl border border-base-nav/50 bg-base-dark/40 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex flex-col gap-4 w-full flex-1">
        <div className="flex md:text-xs lg:text-sm justify-between items-center w-full">
          <p
            className="cursor-pointer hover:text-base-lighter transition-all duration-300 ease-in-out"
            onClick={() => {
              navigator.clipboard.writeText(d.orderNumber);
              setToast({
                message:
                  locale === "en"
                    ? "The Order Number Was Copied To Clipboard"
                    : "لقد تم نسخ رقم الطلب",
                type: "success",
              });
            }}
          >
            # {d.orderNumber}
          </p>
          {isUpdating ? (
            <div className="flex items-center gap-2 px-3 py-1">
              <LoadingSpiner customBorder="w-4 h-4 border-2" />
            </div>
          ) : (
            <p
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${status.bg} ${status.color}`}
            >
              <Icon className="h-4 w-4" />
              {t(d.status)}
            </p>
          )}
        </div>

        <div className="flex w-full justify-between items-center">
          <p>
            {subtotal}: {d.subtotal}
          </p>
          {isUpdating ? (
            <div className="flex items-center gap-2 px-3 py-1">
              <LoadingSpiner customBorder="w-4 h-4 border-2" />
            </div>
          ) : (
            <p
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${payment.bg} ${payment.color}`}
            >
              <PaymentIcon className="h-4 w-4" />
              {paymentT(d.payment.status)}
            </p>
          )}
        </div>

        <div className="w-full flex justify-between items-center">
          <p>
            {shippingCost}: {d.shipping.price}
          </p>
          <p className="py-1 px-3">
            {locale === "en"
              ? d.shipping.zone.cityName
              : d.shipping.zone.cityNameAr}
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <p>
            {total}: {d.total}
          </p>
          <p className="py-1 px-3">{paymentM(d.payment.method)}</p>
        </div>

        <div className="flex flex-1 flex-col justify-center my-auto w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row gap-3 flex-wrap items-center justify-center content-center">
              {d.items?.map((item, index) => {
                if (index >= visibleCount) return null;
                return (
                  <div
                    key={item.id || index}
                    className="w-20 h-20 sm:w-24 sm:h-24 flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-base-nav/30 bg-base-dark/20"
                  >
                    <Image
                      src={item.image?.url || item.image}
                      className="object-contain w-full h-full p-1"
                      width={96}
                      height={96}
                      alt={item.title || "Product Image"}
                    />
                  </div>
                );
              })}

              {!isExpanded && extraCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="flex px-3 py-2 items-center justify-center rounded-lg border border-base-nav/40 bg-base-dark/60 text-sm font-semibold text-gray-200 hover:bg-base-nav/30 active:scale-95 transition-all duration-200"
                >
                  +{extraCount} {locale === "en" ? "more" : "المزيد"}
                </button>
              )}
            </div>

            <div
              className={`w-full grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-row gap-3 flex-wrap items-center justify-center content-center pt-3">
                  {d.items?.map((item, index) => {
                    if (index < visibleCount) return null;
                    return (
                      <div
                        key={item.id || index}
                        className="w-20 h-20 sm:w-24 sm:h-24 flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-base-nav/30 bg-base-dark/20"
                      >
                        <Image
                          src={item.image?.url || item.image}
                          className="object-contain w-full h-full p-1"
                          width={96}
                          height={96}
                          alt={item.title || "Product Image"}
                        />
                      </div>
                    );
                  })}

                  {extraCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="flex px-3 py-2 shrink-0 items-center justify-center rounded-lg border border-base-nav/40 bg-base-dark/60 text-xs font-semibold text-gray-200 hover:bg-base-nav/30 active:scale-95 transition-all duration-200"
                    >
                      {locale === "en" ? "Show Less" : "اعرض القليل"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-auto w-full items-center justify-between">
        <button
          onClick={handlePayment}
          disabled={
            isUpdating ||
            d.payment.status === "paid" ||
            d.payment.status === "cash_on_delivery"
          }
          className={`rounded-lg w-full px-5 py-2 text-sm font-medium text-white active:scale-[0.98] flex items-center justify-center gap-2 ${
            isUpdating ||
            d.payment.status === "paid" ||
            d.payment.status === "cash_on_delivery"
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-primary hover:opacity-90 cursor-pointer"
          }`}
        >
          {isUpdating ? (
            <>
              <LoadingSpiner customBorder="w-4 h-4 border-2" />
              <span>{PayNow}</span>
            </>
          ) : d.payment.status === "paid" ? (
            Paid
          ) : d.payment.method === "cash" ? (
            cash
          ) : (
            PayNow
          )}
        </button>
        <button
          onClick={() => {
            setSelectedData(d);
            setOpenModule(true);
          }}
          className="rounded-lg w-full cursor-pointer border border-base-nav px-5 py-2 text-sm font-medium hover:bg-base-nav/20 active:scale-[0.98]"
        >
          {ShowDetails}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
