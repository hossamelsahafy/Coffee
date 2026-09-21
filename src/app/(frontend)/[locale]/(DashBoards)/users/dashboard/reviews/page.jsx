import React from "react";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import { getTranslations } from "next-intl/server";
import ReviewsGrid from "@/components/ui/Taps/Reviews/ReviewsGrid";
import { getUser } from "@/actions/getUser";

export default async function Page({ params }) {
  const { locale } = await params;

  const user = await getUser();
  console.log(user);

  const userId = user?.id;

  const whereClause = userId
    ? {
        ClientName: {
          equals: userId,
        },
      }
    : {};

  const data = await GetDataWithPagination(
    "reviews",
    1,
    9,
    "-updatedAt",
    whereClause,
    true,
  );

  const t = await getTranslations("ReviewsDashBoard");
  const title = t("title");
  const subtitle = t("subtitle");
  const MyThing = t("MyAccount");
  console.log(data);

  return (
    <div className="relative w-full">
      <ContentLayout
        locale={locale}
        title={title}
        subtitle={subtitle}
        MyThing={MyThing}
        isdiff={true}
      >
        <ReviewsGrid
          locale={locale}
          initialData={data}
          initialPage={1}
          userId={userId}
        />
      </ContentLayout>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "تقيماتي" : "My Reviews",
    robots: {
      index: false,
      follow: false,
    },
  };
}
