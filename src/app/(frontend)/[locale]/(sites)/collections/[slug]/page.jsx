import React from "react";
import GetFilteredData from "@/actions/GetFilteredData";
import CollectionElements from "@/components/ui/CollectionPage/CollectionElements";
import FiltersAndProductsSection from "@/components/shared/FiltersAndProductsSection/FiltersAndProductsSection";
const page = async ({ params }) => {
  const param = await params;
  const locale = param.locale;
  const slug = param.slug;

  const data = await GetFilteredData({
    collection: "products",
    filterKey: locale === "en" ? "category.slug" : "category.slugAr",
    filterValue: decodeURIComponent(slug),
  });

  return (
    <div className="border-t mt-20 border-base-border w-full">
      <CollectionElements data={data} locale={locale} />
      <div className="w-full bg-base-lighter min-h-screen">
        <FiltersAndProductsSection
          locale={locale}
          CurrentLocation={
            locale === "en" ? data[0].category.title : data[0].category.titleAr
          }
          data={data}
        />
      </div>
    </div>
  );
};

export default page;
