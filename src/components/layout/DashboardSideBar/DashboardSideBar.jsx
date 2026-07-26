import Link from "next/link";
import LogoutSection from "./LogoutSection";
import { FiSidebar } from "react-icons/fi";

const DashboardSideBar = ({
  locale,
  setOpenModule,
  setOpenSidebar,
  openSidebar,
  setActiveTab,
  pathname,
  firstName,
}) => {
  const links = [
    { id: "account", name: "Account", nameAr: "الحساب", href: "/account" },
    { id: "dashboard", name: "Dashboard", nameAr: "لوحة التحكم", href: "" },
    {
      id: "favorites",
      name: "Favorites",
      nameAr: "المفضلات",
      href: "/favorites",
    },

    { id: "orders", name: "Orders", nameAr: "الطلبات", href: "/orders" },
    {
      id: "track-orders",
      name: "Track Orders",
      nameAr: "تتبع الطلبات",
      href: "/track-orders",
    },
  ];

  const isRtl = locale === "ar";

  return (
    <>
      <button
        onClick={() => setOpenSidebar(!openSidebar)}
        className={`fixed z-40 top-4 p-2 rounded-lg bg-base-nav text-base-light border border-white/10 ${
          isRtl ? "right-4" : "left-4"
        }`}
      >
        <FiSidebar size={22} />
      </button>

      <aside
        className={`fixed md:sticky top-0 z-50 flex h-screen bg-base-dark flex-col transition-all duration-300 ease-in-out shrink-0
  ${isRtl ? "right-0" : "left-0"}
  ${
    openSidebar
      ? "md:w-64 w-full opacity-100 border-e border-base-nav"
      : "w-0 opacity-0 pointer-events-none border-transparent max-md:-translate-x-full"
  }`}
      >
        <div className="md:w-64 w-full p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold text-base-light">
              {locale === "en"
                ? ` ${firstName}'s Account`
                : `حساب ${firstName}`}
            </h2>
            <button
              onClick={() => setOpenSidebar(!openSidebar)}
              className="rounded-lg p-2 text-base-light transition hover:bg-base-nav"
            >
              <FiSidebar size={22} />
            </button>
          </div>

          <p className="text-sm text-base-lighter">
            {locale === "en" ? "Control your profile" : "تحكم في ملفك الشخصي"}
          </p>
        </div>

        <div className="w-full border-t border-base-nav" />

        <nav className="flex-1 flex flex-col justify-between h-full space-y-4 whitespace-nowrap">
          <div className="space-y-3 p-4">
            {links.map((link) => {
              const fullHref = `/${locale}/users/dashboard${link.href}`;
              const isActive =
                pathname === fullHref || pathname === `${fullHref}/`;

              return (
                <Link
                  key={link.id}
                  href={`/users/dashboard${link.href}`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setOpenSidebar(false);
                  }}
                  className={`block w-full rounded-xl px-4 py-3 text-sm font-medium text-start transition hover:bg-base-nav ${
                    isActive ? "bg-base-nav text-[#D8A46B]" : "text-gray-300"
                  }`}
                >
                  {locale === "en" ? link.name : link.nameAr}
                </Link>
              );
            })}
          </div>

          <div className="">
            <div className="w-full border-t border-base-nav" />
            <div className="p-4">
              <Link
                href={pathname.replace(
                  `/${locale}`,
                  `/${locale === "en" ? "ar" : "en"}`,
                )}
                className="flex w-full items-center justify-center rounded-xl border border-base-nav px-4 py-2.5 text-sm font-medium text-base-light transition hover:bg-base-nav"
              >
                {locale === "en" ? "🌐 العربية" : "🌐 English"}
              </Link>
            </div>
          </div>
        </nav>

        <div className="w-full border-t border-base-nav" />
        <div className="">
          <LogoutSection locale={locale} setOpenModule={setOpenModule} />
        </div>
      </aside>
    </>
  );
};

export default DashboardSideBar;
