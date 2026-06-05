"use client";
import React from "react";
import { useEffect } from "react";
import { useCart } from "@/Context/CartContext";
const Orders = () => {
  const { clearCart } = useCart();
  useEffect(() => {
    const url = new URL(window.location.href);
    const fromPayment = url.searchParams.get("payment");
    if (
      fromPayment === "pending" ||
      fromPayment === "cash" ||
      fromPayment === "paid"
    ) {
      clearCart();
    }
  }, []);
  return <div>Orders</div>;
};

export default Orders;
