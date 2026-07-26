import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/Context/CartContext";
import DashboardClient from "@/components/layout/DashboardSideBar/DashBoardClient";
import { UserProvider } from "@/Context/userContext";
import { getUser } from "@/actions/getUser";
import { DashboardProvider } from "@/Context/DashboardContext";
import "@/styles/globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await getUser();

  const { locale } = await params;
  const messages = await getMessages({ locale });

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${cairo.className} min-h-screen bg-base-dark text-white`}
      >
        <DashboardProvider>
          <CartProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <UserProvider initialUser={user}>
                <div className="flex min-h-screen w-full relative">
                  <DashboardClient locale={locale} />
                  <main className="flex-1 min-w-0 w-full">{children}</main>
                </div>
              </UserProvider>
            </NextIntlClientProvider>
          </CartProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}
