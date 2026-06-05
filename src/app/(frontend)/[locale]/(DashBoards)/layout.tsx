import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/Context/CartContext";
import "@/styles/globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${cairo.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <main className="flex-1">{children}</main>
          </NextIntlClientProvider>
        </CartProvider>
      </body>
    </html>
  );
}
