import React from "react";
import Header from "@/components/shared/Headers/Header";
import { useTranslations } from "next-intl";
const MainPage = ({ dataLength, locale }) => {
  const t = useTranslations("ProductsMainPage");
  const title = t("title");
  const des = t("des");
  const backToHome = t("backToHome");
  return (
    <div className="container-custom p-4 mt-10">
      <Header
        backToHome={backToHome}
        title={title}
        des={des}
        locale={locale}
        length={dataLength}
      />
    </div>
  );
};

export default MainPage;
