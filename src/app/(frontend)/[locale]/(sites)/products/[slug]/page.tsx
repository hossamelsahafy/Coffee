import React from "react";
import GetDataBySlug from "@/actions/GetDataBySlug";
import GetFilteredData from "@/actions/GetFilteredData";
import ProductSlugClient from "@/components/ui/ProductsPage/Slug/ProductSlugClient";
import { getUser } from "@/actions/getUser";

import GetDataServerSide from "@/actions/GetDataServerSide";
type Props = {
  params: {
    locale: string;
    slug: string;
  };
};
const page = async ({ params }: Props) => {
  const param = await params;
  const slugName = param.slug;
  const locale = param.locale;
  const user = await getUser();
  const favorites = user
    ? await GetDataServerSide("favorites?depth=1", "GET")
    : null;

  const dataBySlug = await GetDataBySlug("products", slugName, locale);
  const products = await GetFilteredData({
    collection: "products",
    filterKey: "ShowInDiscountSection",
    slugName,
    filterValue: true,
  });
  const importantProducts = await GetFilteredData({
    collection: "products",
    filterKey: "important",
    slugName: "",
    filterValue: true,
  });

  return (
    <>
      <ProductSlugClient
        importantProducts={importantProducts}
        locale={locale}
        dataBySlug={dataBySlug}
        products={products}
        userFavorites={favorites}
      />
    </>
  );
};

export default page;
