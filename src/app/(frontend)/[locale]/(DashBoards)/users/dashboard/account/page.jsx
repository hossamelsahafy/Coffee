import React from "react";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import { getTranslations } from "next-intl/server";
import Account from "@/components/ui/Taps/AccountTap/Account";
export default async function ({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Account");
  const title = t("title");
  const subtitle = t("subtitle");
  const MyAccount = t("MyAccount");

  return (
    <div className="w-full">
      <ContentLayout
        locale={locale}
        title={title}
        subtitle={subtitle}
        MyThing={MyAccount}
      >
        <div className="w-full">
          <Account locale={locale} />
        </div>
      </ContentLayout>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "حسابي" : "My Account",

    robots: {
      index: false,
      follow: false,
    },
  };
}
