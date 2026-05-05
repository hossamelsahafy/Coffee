import React from "react";
import GetDataBySlug from "@/actions/GetDataBySlug";
import ProductSlug from "@/components/ui/ProductsPage/Slug/ProductSlug";
import GetFilteredData from "@/actions/GetFilteredData";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
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

  const dataBySlug = await GetDataBySlug("products", slugName, locale);
  const products = await GetFilteredData({
    collection: "products",
    filterKey: "ShowInDiscountSection",
    slugName,
  });
  const importantProducts = await GetFilteredData({
    collection: "products",
    filterKey: "important",
    slugName: "",
  });

  return (
    <div className="border-t p-4 mt-20 border-base-border w-full">
      <ProductSlug data={dataBySlug} locale={locale} products={products} />
      <div className="h-full w-full">
        <HeaderTwo
          importantProducts={importantProducts}
          src={
            "https://res.cloudinary.com/dnszjyuxi/video/upload/v1777996181/d07af386638640c5be2b435380d446de_zsllkn.mp4"
          }
        />
      </div>
    </div>
  );
};

export default page;
