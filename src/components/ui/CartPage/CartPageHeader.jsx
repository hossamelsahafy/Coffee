import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
const CartPageHeader = ({ locale }) => {
  const t = useTranslations("Cart");
  const cart = t("cart");
  const backToHome = locale === "en" ? "Back To Home" : "الرجوع للرئيسية";
  return (
    <div className="container-custom p-4">
      <div className="flex flex-col items-stretch w-full gap-4">
        <h2 className="text-4xl font-bold text-center text-base-coffe">
          {cart}
        </h2>
        <div className="flex w-full justify-start ">
          <Link href={`/${locale}`}>
            <div className="flex items-center gap-2">
              <div className="border border-base-light rounded-full p-2">
                {locale === "en" ? (
                  <FaArrowLeft className="text-base-light text-base" />
                ) : (
                  <FaArrowRight className="text-base-light text-base" />
                )}
              </div>
              <p>{backToHome}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPageHeader;
