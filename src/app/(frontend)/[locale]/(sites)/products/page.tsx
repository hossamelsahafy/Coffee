import React from "react";
import GetAllData from "@/actions/GetAllData";
import MainPage from "@/components/ui/ProductsPage/MainPage";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
type Props = {
  params: {
    locale: string;
  };
};

const page = async ({ params }: Props) => {
  const { locale } = await params;
  const product = await GetAllData("products");
  const dataLength = product.length;
  const CurrentLocation = locale === "en" ? "All Products" : "جميع المنتجات";

  return (
    <div id="productPage" className="border-t mt-20 border-base-border w-full">
      <MainPage dataLength={dataLength} locale={locale} />
      <div className="w-full bg-base-lighter min-h-screen">
        <FiltersAndProductsSection
          locale={locale}
          CurrentLocation={CurrentLocation}
          data={product}
        />
      </div>
    </div>
  );
};

export default page;
