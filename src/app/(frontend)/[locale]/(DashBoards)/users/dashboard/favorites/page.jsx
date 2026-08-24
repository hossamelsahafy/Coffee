import React from "react";
import { getUser } from "@/actions/getUser";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import { getTranslations } from "next-intl/server";
import getDataServerSide from "@/actions/GetDataServerSide";
import FavoritesData from "@/components/ui/Taps/FavoritesTap/FavoritesData";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
export default async function ({ params }) {
  const { locale } = await params;
  const user = await getUser();
  const t = await getTranslations("Favorites");
  const title = t("title");
  const subtitle = t("subtitle");
  const MyAccount = t("MyAccount");
  const NotYet = t("NoData");
  const data = await GetDataWithPagination("/favorites", 1, 9, "", {}, true);
  console.log(data);

  return (
    <div className="">
      <ContentLayout
        locale={locale}
        user={user}
        title={title}
        subtitle={subtitle}
        MyThing={MyAccount}
        isdiff={true}
      >
        <FavoritesData
          locale={locale}
          data={data.docs}
          NotYet={NotYet}
          pagination={{
            page: data.page,
            totalPages: data.totalPages,
            hasNextPage: data.hasNextPage,
            hasPrevPage: data.hasPrevPage,
            totalDocs: data.totalDocs,
          }}
        />
      </ContentLayout>
    </div>
  );
}
