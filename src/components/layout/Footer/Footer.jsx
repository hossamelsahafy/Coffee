"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { CiFacebook } from "react-icons/ci";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { CiInstagram } from "react-icons/ci";
import Link from "next/link";

const Footer = ({
  websiteName,
  title,
  span,
  des,
  leftSideImage,
  RightSideImage,
  locale,
  FaceBookLink,
  InstgramLink,
  WhatsappLink,
  XLink,
}) => {
  const t = useTranslations("footer");

  const shopLinks = t.raw("shopLinks") || [];
  const accountLinks = t.raw("accountLinks") || [];

  const shareIcons = [
    { icon: CiFacebook, href: FaceBookLink },
    { icon: CiInstagram, href: InstgramLink },
    { icon: FaWhatsapp, href: WhatsappLink },
    { icon: FaXTwitter, href: XLink },
  ];

  const formatHref = (href) => {
    return href.replace("{locale}", locale);
  };

  return (
    <footer className="relative border-base-border text-base-light border-t w-full flex flex-col justify-between overflow-hidden p-5 md:p-8 bg-[#120c0a]">
      {RightSideImage && (
        <div
          className={`absolute inset-y-0 ${
            locale === "en" ? "right-0" : "left-0"
          } w-1/2 md:w-1/3 pointer-events-none z-0`}
        >
          <Image
            src={RightSideImage}
            alt="right image decoration"
            fill
            className="object-cover object-right h-full opacity-60 md:opacity-90"
          />
          <div
            className={`absolute inset-0 ${
              locale === "en" ? "bg-linear-to-r" : "bg-linear-to-l"
            } from-[#120c0a] via-[#120c0a]/70 to-transparent`}
          />
        </div>
      )}

      <div className="relative flex flex-col md:flex-row z-10 justify-between items-start flex-wrap gap-5 w-full">
        {leftSideImage && (
          <div className="hidden lg:block shrink-0">
            <Image
              width={300}
              height={300}
              alt="left image"
              src={leftSideImage}
            />
          </div>
        )}

        <div className="flex flex-col justify-center w-full lg:max-w-102.5 mt-5 lg:mt-10 items-start gap-2">
          <p className="Coffetitle font-semibold text-base-coffe">
            {websiteName}
          </p>

          <p className="text-3xl font-semibold text-base-light">{title}</p>
          <span className="text-3xl font-semibold text-base-coffe">{span}</span>
          <span className="mt-4 text-base font-semibold text-base-light w-full leading-relaxed">
            {des}
          </span>
        </div>

        <div className="flex flex-col mt-5 lg:mt-10 gap-2">
          <span className="font-bold text-2xl">{t("shop")} :</span>
          <ul className="flex flex-col gap-2">
            {shopLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={formatHref(link.href)}
                  className="hover:text-base-coffe transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col mt-5 lg:mt-10 gap-2">
          <span className="font-bold text-2xl">{t("account")} :</span>
          <ul className="flex flex-col gap-2">
            {accountLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={formatHref(link.href)}
                  className="hover:text-base-coffe transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col mt-5 md:mx-4 lg:mt-10 gap-2">
          <span className="font-bold text-2xl">{t("share")} :</span>
          <div className="flex flex-row gap-4">
            {shareIcons.map((link, index) => (
              <Link
                key={index}
                href={link.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-base-light rounded-lg hover:opacity-80 transition-opacity"
              >
                <link.icon className="w-4 h-4 text-base-dark" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex relative z-10 gap-2 lg:mx-16 mt-10 pt-4">
        <div className="flex md:flex-row flex-col w-full justify-between gap-2 lg:justify-around text-center">
          <p className="text-base font-semibold text-base-light">
            {locale === "en" ? (
              <>
                &copy; {new Date().getFullYear()} • Powered by Me • All rights
                reserved
              </>
            ) : (
              <>
                جميع الحقوق محفوظة • تم التطوير بواسطة •{" "}
                {new Date().getFullYear()} &copy;
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
