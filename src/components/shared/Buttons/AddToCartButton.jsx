"use client";
import Link from "next/link";
import React from "react";
import { useCart } from "@/Context/CartContext";

const AddToCartButton = ({
  text,
  isLink,
  linkTarget,
  width,
  disabled,
  custBg,
  Product,
  selectedOption,
  quantity,
}) => {
  const { addToCart } = useCart();
  const style = `px-6 py-2 hover:bg-base-lighter transition-all text-center duration-300 ${width} font-bold bg-base-coffe text-base-dark rounded-full ${disabled ? `opacity-50 cursor-not-allowed ${custBg ? custBg : ""}` : "cursor-pointer"}`;

  return isLink ? (
    <Link href={linkTarget} className={style}>
      {text}
    </Link>
  ) : (
    <button
      onClick={() => addToCart(Product, selectedOption, quantity)}
      disabled={disabled}
      className={`${style}`}
    >
      {text}
    </button>
  );
};

export default AddToCartButton;
