import React from "react";
import { useTranslations } from "next-intl";
const CartPageHeader = () => {
  const t = useTranslations("Cart");
  const cart = t("cart");
  return (
    <div className="container-custom p-4">
      <div className="flex flex-col gap-4 justify-center">
        <h2 className="text-4xl font-bold text-base-coffe">{cart}</h2>
      </div>
    </div>
  );
};

export default CartPageHeader;
