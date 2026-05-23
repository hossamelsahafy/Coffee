"use client";

import React, { useMemo } from "react";
import { useCart } from "@/Context/CartContext";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
const CartDetails = ({ locale }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();
  const shipping = 5;

  const total = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    return cart.length ? subtotal + shipping : 0;
  }, [cart]);
  const t = useTranslations("Cart");
  return (
    <div className="container-custom p-8">
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

                  <span className="min-w-[20px] text-center font-medium">
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
            {/* Products */}
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

            <div className="border-t border-dashed border-[#D8CBB8] pt-4 flex justify-between">
              <span className="text-[#6B5B4D]">{t("Shipping")}</span>

              <span className="text-[#3E2C23]">${shipping}</span>
            </div>

            <div className="border-t border-[#E8E0D1] pt-4 flex justify-between text-lg font-bold text-[#3E2C23]">
              <span>{t("Total")}</span>

              <span>${total}</span>
            </div>

            <button className="mt-4 rounded-full bg-[#6F4E37] py-4 text-white font-semibold hover:opacity-90 transition">
              {t("Checkout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
