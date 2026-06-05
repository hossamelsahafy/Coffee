"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/Context/CartContext";
import { useTranslations } from "next-intl";
import slugMethods from "@/actions/SlugMethods";
import { useRouter } from "next/navigation";
import StripeModule from "./StripeModule";
import LoadingSpiner from "@/components/shared/Spiner/LoadingSpiner";
const CheckoutDetails = ({ locale, shippingData }) => {
  const t = useTranslations("Checkout");
  const { cart, clearCart } = useCart();

  const [selectedCity, setSelectedCity] = useState(shippingData[0]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const subtotal = useMemo(() => {
    return cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }, [cart]);

  const shipping = selectedCity?.shippingPrice || 0;
  const total = subtotal + shipping;
  let Currancy = "USD";

  const orderPayload = {
    items: cart.map((item) => ({
      product: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      selectedOptions: item.optionId,
    })),
    shipping: {
      zone: selectedCity.id,
    },
    payment: {
      method: paymentMethod,
    },
  };
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (loading || submittingOrder) return;

    try {
      setLoading(true);
      setSubmittingOrder(true);
      const data = await slugMethods("orders", "POST", orderPayload);

      if (paymentMethod === "stripe") {
        setSuccessMessage(
          locale === "en"
            ? "Order created successfully. Please complete payment via Stripe. If payment is not completed within 24 hours, the order will be cancelled."
            : "تم إنشاء الطلب بنجاح. برجاء إتمام الدفع عبر Stripe. في حال عدم إتمام الدفع خلال 24 ساعة سيتم إلغاء الطلب.",
        );
        setStripeOrderId(data.doc.id);
        setStripeOpen(true);
      }

      if (paymentMethod === "cash") {
        setSuccessMessage(
          locale === "en"
            ? "Order submitted successfully. Redirecting in 10 seconds..."
            : "تم إنشاء الطلب بنجاح. سيتم تحويلك خلال 10 ثوانٍ...",
        );
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/users/orders?payment=cash");
        }, 10000);
      }
    } catch (err) {
      setErrorMessage(
        err?.message ||
          (locale === "en"
            ? "Something went wrong"
            : "حدث خطأ أثناء إنشاء الطلب"),
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 10000);
    } finally {
      setLoading(false);
    }
  };
  if (cart.length < 1) {
    return (
      <div className="container-custom p-4 relative">
        <h2 className="text-3xl font-bold text-center text-base-coffe mb-6">
          {t("header")}
        </h2>
        <div className="flex flex-col justify-center items-center bg-base-coffe/10 border border-base-border rounded-2xl p-5">
          <p className="text-xl font-bold items-center">
            {locale === "en"
              ? "No Products Was Added To Cart Yet"
              : "لم يتم اضافة منتجات لعربية التسوق بعد"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="container-custom p-4">
        <h2 className="text-3xl font-bold text-center text-base-coffe mb-6">
          {t("header")}
        </h2>

        <div className="flex md:flex-row flex-col gap-6 w-full relative">
          <div className="flex flex-col gap-6 w-full">
            <div className="bg-base-coffe/10 border border-base-border rounded-2xl p-5">
              <h3 className="font-semibold text-base-coffe mb-4">
                {t("cartItems")}
              </h3>

              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.optionId}`}
                  className="flex flex-col gap-1 py-3 border-b border-base-border"
                >
                  <span className="text-base-coffe font-medium wrap-break-word">
                    {locale === "en" ? item.title : item.titleAr}
                  </span>

                  <span className="text-sm text-base-coffe/70">
                    {locale === "en" ? item.optionType : item.optionTypeAr} :{" "}
                    {locale === "en" ? item.optionValue : item.optionValueAr}
                  </span>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-base-coffe/70">
                      {item.quantity} × {item.price} {Currancy}
                    </span>

                    <span className="text-base-coffe font-semibold">
                      {item.quantity * item.price} {Currancy}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-base-coffe/10 border border-base-border rounded-2xl p-5">
              <h3 className="font-semibold text-base-coffe mb-4">
                {t("shipping")}
              </h3>

              <select
                value={selectedCity?.id}
                onChange={(e) => {
                  const city = shippingData.find(
                    (c) => c.id === e.target.value,
                  );
                  setSelectedCity(city);
                }}
                className="w-full bg-base-light text-base-dark border border-base-border rounded-xl p-2"
              >
                {shippingData.map((city) => (
                  <option key={city.id} value={city.id}>
                    {locale === "en" ? city.cityName : city.cityNameAr}
                  </option>
                ))}
              </select>

              <p className="text-xs text-base-coffe mt-2">
                {t("shippingFeeNotice")}
              </p>
            </div>

            <div className="bg-base-coffe/10 border border-base-border rounded-2xl p-5">
              <h3 className="font-semibold text-base-coffe mb-4">
                {t("paymentMethod")}
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "cash"
                      ? "bg-base-coffe text-base-light border-base-coffe"
                      : "bg-transparent text-base-nav border-base-border"
                  }`}
                >
                  💵 {t("cashOnDelivery")}
                </div>

                <div
                  onClick={() => {
                    setPaymentMethod("stripe");
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "stripe"
                      ? "bg-base-coffe text-base-light border-base-coffe"
                      : "bg-transparent text-base-nav border-base-border"
                  }`}
                >
                  💳 {t("onlinePayment")}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div
              className={`${stripeOpen ? "" : "sticky"} top-26 border border-base-border bg-base-coffe/10 text-base-light rounded-2xl p-6 flex flex-col gap-4`}
            >
              <h3 className="text-lg font-bold text-base-light">
                {t("orderSummary")}
              </h3>

              <div className="flex justify-between text-base-light/80">
                <span>{t("subtotal")}</span>
                <span>
                  {subtotal} {Currancy}
                </span>
              </div>

              <div className="flex justify-between text-base-light/80">
                <span>{t("shipping")}</span>
                <span>
                  +{shipping} {Currancy}
                </span>
              </div>

              <div className="border-t border-base-light/20 pt-3 flex justify-between text-xl font-bold">
                <span>{t("total")}</span>
                <span>
                  {total} {Currancy}
                </span>
              </div>
              {stripeOpen ? (
                <p className="text-sm text-center text-amber-300 mt-2">
                  {locale === "en"
                    ? "Please complete payment to continue"
                    : "برجاء اكمال بيانات الدفع للمتابعة"}
                </p>
              ) : (
                <button
                  disabled={loading || stripeOpen}
                  className="bg-base-light text-base-coffe py-3 rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePlaceOrder}
                >
                  {loading || stripeOpen ? (
                    <span className="flex items-center justify-center text-center gap-2">
                      {locale === "en" ? "Processing..." : "جاري المعالجة..."}
                      <LoadingSpiner customBorder={"border-base-coffe"} />
                    </span>
                  ) : (
                    t("placeOrder")
                  )}
                </button>
              )}
              {successMessage && (
                <div className="rounded-xl border border-base-light/20 bg-base-light/10 p-3 text-center text-sm text-base-light">
                  ✓ {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-center text-sm text-amber-200">
                  ⚠ {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
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

export default CheckoutDetails;
