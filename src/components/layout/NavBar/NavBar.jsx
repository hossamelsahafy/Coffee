"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { CiSearch } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";
import { useCart } from "@/Context/CartContext";
import { useSiteSettings } from "@/Context/CurrencyContext";

const NavBar = ({ locale }) => {
  const t = useTranslations("nav");

  const otherLocale = locale === "en" ? "ar" : "en";

  const [menuOpen, setMenuOpen] = useState(false);

  const { currencies, selectedCurrency, setSelectedCurrency } =
    useSiteSettings();

  const { cart } = useCart();

  const itemslength = cart.length;

  const localesData = {
    en: {
      label: "English",
      flag: "/assets/usa.png",
    },
    ar: {
      label: "العربية",
      flag: "/assets/flag.png",
    },
  };

  const navLinks = [
    {
      id: 4,
      name: t("products"),
      href: "products",
    },
    {
      id: 1,
      name: t("collection"),
      href: "collections",
    },
    {
      id: 2,
      name: t("aboutUs"),
      href: "about-us",
    },
    {
      id: 6,
      name: t("contactUs"),
      href: "contact-us",
    },
  ];

  const item = t("item");

  const icons = [
    {
      name: CiSearch,
      href: "",
    },
    {
      name: IoPerson,
      href: "/users/dashboard/account",
    },
  ];

  const handleCurrencyChange = (value) => {
    const selected = currencies.find((currency) => currency.value === value);

    if (selected) {
      setSelectedCurrency(selected);
    }
  };

  return (
    <div className="relative z-20 w-full">
      <div className="absolute inset-0 hidden lg:block">
        <DesktopNav
          locale={locale}
          navLinks={navLinks}
          otherLocale={otherLocale}
          localesData={localesData}
          item={item}
          currency={selectedCurrency.value}
          currenciesData={currencies}
          onChangecurrency={handleCurrencyChange}
          t={t}
          icons={icons}
          itemslength={itemslength}
        />
      </div>

      <div className="absolute inset-0 block lg:hidden">
        <MobileNav
          locale={locale}
          navLinks={navLinks}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          otherLocale={otherLocale}
          localesData={localesData}
          currency={selectedCurrency.value}
          currenciesData={currencies}
          onChangecurrency={handleCurrencyChange}
          t={t}
          item={item}
          icons={icons}
          itemslength={itemslength}
        />
      </div>
    </div>
  );
};

export default NavBar;
