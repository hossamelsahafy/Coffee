import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo } from "next/font/google";

import NavBar from "@/components/layout/NavBar/NavBar";
import FooterData from "@/components/layout/Footer/FooterData";
import { CartProvider } from "@/Context/CartContext";
import { UserProvider } from "@/Context/userContext";
import { getUser } from "@/actions/getUser";
import { getDataCache } from "@/lib/GetDataCache";

import "@/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const settings = await getDataCache("globals/site-settings");

  const isArabic = locale === "ar";

  const title = isArabic ? settings?.siteNameAr : settings?.siteName;

  const description = isArabic
    ? settings?.descriptionAr
    : settings?.description;

  const image =
    settings?.ImageSource === "Url"
      ? settings?.ImageUrl
      : settings?.ImageUpload?.url;

  return {
    metadataBase: settings?.websiteUrl
      ? new URL(settings.websiteUrl)
      : undefined,

    title: {
      default: title,
      template: `%s | ${title}`,
    },

    description,

    robots: {
      index: true,
      follow: true,
    },

    icons: {
      icon: "/assets/favicon.ico",
    },

    openGraph: {
      type: "website",
      siteName: title,
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const user = await getUser();
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${cairo.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <UserProvider initialUser={user}>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <NavBar locale={locale} />

              <main className="flex-1">{children}</main>

              <FooterData locale={locale} />
            </NextIntlClientProvider>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
