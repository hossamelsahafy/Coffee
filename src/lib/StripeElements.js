"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeElements({ clientSecret, children }) {
  const appearance = {
    variables: {
      colorBackground: "#1c1410",
      colorText: "#ffffff",
      colorPrimary: "#a7897b",

      colorTextSecondary: "#c4a998",
      colorSecondaryText: "#c4a998",

      borderRadius: "12px",
    },

    rules: {
      ".Input": {
        backgroundColor: "#2b221d",
        border: "1px solid #423826",
        color: "#ffffff",
      },

      ".Input:focus": {
        border: "1px solid #a7897b",
        boxShadow: "0 0 0 3px rgba(167, 137, 123, 0.2)",
      },

      ".Label": {
        color: "#c4a998",
      },

      ".Tab": {
        backgroundColor: "#2b221d",
        border: "1px solid #423826",
        color: "#c4a998",
      },

      ".Tab--selected": {
        backgroundColor: "rgba(167, 137, 123, 0.12)",
        border: "1px solid #a7897b",
        color: "#ffffff",
      },

      ".Block": {
        backgroundColor: "#2b221d",
        border: "1px solid #423826",
      },

      // 🔥 IMPORTANT FIX (this removes gray feeling)
      ".Wrapper": {
        backgroundColor: "transparent",
      },

      ".Container": {
        backgroundColor: "transparent",
      },

      ".Form": {
        backgroundColor: "transparent",
      },

      ".PaymentForm": {
        backgroundColor: "transparent",
      },

      ".Error": {
        color: "#ef4444",
      },

      ".Button": {
        backgroundColor: "#a7897b",
        color: "#ffffff",
      },

      ".Button:hover": {
        backgroundColor: "#8f7569",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      {children}
    </Elements>
  );
}
