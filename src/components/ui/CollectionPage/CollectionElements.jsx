import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/shared/Headers/Header";

const CollectionElements = ({ data, locale }) => {
  const t = useTranslations("CollectionElemnts");
  const title =
    locale === "en" ? data[0].category.title : data[0].category.titleAr;
  const des = locale === "en" ? data[0].category.des : data[0].category.desAr;
  const length = data.length;
  const backToHome = t("backToHome");
  return (
    <div className="container-custom p-4 mt-10">
      <Header
        des={des}
        length={length}
        locale={locale}
        backToHome={backToHome}
        title={title}
      />
    </div>
  );
};

export default CollectionElements;
