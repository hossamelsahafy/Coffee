"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";
import { FaShippingFast } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const Breadcrumb = ({ locale }) => {
  const pathname = usePathname();

  let segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== locale);

  segments = segments.filter((segment) => segment !== "users");

  const names = {
    dashboard: {
      en: "Users Dashboard",
      ar: "لوحة تحكم المستخدم",
      icons: MdOutlineSpaceDashboard,
    },
    account: {
      en: "Account",
      ar: "الحساب",
      icons: MdManageAccounts,
    },
    cart: {
      en: "Cart",
      ar: "السلة",
      icons: FaCartArrowDown,
    },
    Favourite: {
      en: "Favourites",
      ar: "المفضلة",
      icons: FaHeart,
    },
    orders: {
      en: "Orders",
      ar: "الطلبات",
      icons: TbPackages,
    },
    "track-orders": {
      en: "Track Orders",
      ar: "تتبع الطلبات",
      icons: FaShippingFast,
    },
  };

  return (
    <nav
      className={`text-md font-semibold w-full text-base-lighter flex items-center flex-wrap overflow-hidden  gap-2`}
    >
      <Link
        href={`/${locale}`}
        className="hover:text-white gap-1 flex items-center"
      >
        <IoIosHome />
        {locale === "en" ? "Home" : "الرئيسية"}
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;

        const item = names[segment];
        const label = item?.[locale] || segment;
        const Icon = item?.icons;

        const href =
          segment === "dashboard"
            ? `/${locale}/users/dashboard`
            : `/${locale}/users/dashboard/${segment}`;

        return (
          <div key={segment} className="flex items-center gap-2">
            <span>/</span>

            <div
              className={`flex items-center gap-1 ${
                isLast ? "text-base-light" : "hover:text-base-light"
              }`}
            >
              {Icon && <Icon size={18} />}

              {isLast ? (
                <span className="text-white">{label}</span>
              ) : (
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
