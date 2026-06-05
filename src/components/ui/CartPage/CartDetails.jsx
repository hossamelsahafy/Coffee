"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/Context/CartContext";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
const CartDetails = ({ locale, data }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const total = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    return cart.length ? subtotal : 0;
  }, [cart]);
  const t = useTranslations("Cart");
  if (cart.length < 1) {
    return (
      <p className="text-center font-semibold text-lg my-4">
        {locale === "en"
          ? "No Products Was Added Yet"
          : "لم يتم اضافة منتجات بعد"}
      </p>
    );
  }
  return (
    <div className="container-custom p-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="flex flex-col gap-5">
          {cart.map((c) => (
            <div
              key={`${c.productId}-${c.optionId}`}
              className="flex items-center justify-between rounded-3xl  bg-base-coffe p-4 shadow-sm gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="bg-base-Cards rounded-2xl p-2">
                  <Image
                    src={c.image}
                    width={90}
                    height={90}
                    alt="Product Image"
                    className="object-contain rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-[#3E2C23]">
                    {locale === "en" ? c.title : c.titleAr}
                  </h2>

                  <p className="text-sm text-[#8B7355]">
                    {locale === "en" ? c.optionTitle : c.optionTitleAr}
                  </p>

                  <p className="font-bold text-[#6F4E37]">
                    ${c.price * c.quantity}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-3 rounded-full bg-base-Cards px-3 py-2">
                  <button
                    onClick={() => decreaseQuantity(c.productId, c.optionId)}
                    className="hover:scale-110 transition cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-5 text-center font-medium">
                    {c.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(c.productId, c.optionId)}
                    className="hover:scale-110 transition cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(c.productId, c.optionId)}
                  className="flex items-center gap-1 text-sm hover:text-base-nav transition cursor-pointer"
                >
                  <Trash2 size={16} />
                  {t("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-[#E8E0D1] bg-[#FFFDF9] p-6 shadow-sm sticky top-6">
          <h2 className="text-2xl font-bold text-[#3E2C23] mb-6">
            {t("OrderSummary")}
          </h2>

          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.optionId}`}
                className="flex justify-between text-sm"
              >
                <span className="text-[#6B5B4D]">
                  {item.quantity} ×{" "}
                  {locale === "en" ? item.title : item.titleAr}
                </span>

                <span className="font-medium text-[#6B5B4D]">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t border-[#E8E0D1] pt-4 flex justify-between text-lg font-bold text-[#3E2C23]">
              <span>{t("Total")}</span>

              <span>${total}</span>
            </div>

            <Link
              href={"/users/checkout"}
              onClick={""}
              className="mt-4 text-center rounded-full bg-[#6F4E37] py-4 text-white font-semibold hover:opacity-90 transition cursor-pointer"
            >
              {t("Checkout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
