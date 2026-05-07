import React from "react";
import GetAllData from "@/actions/GetAllData";
import Collection from "@/components/ui/CollectionPage/Collection";
const page = async ({ params }) => {
  const { locale } = await params;

  const categories = await GetAllData("categories");

  return (
    <div>
      <Collection data={categories} locale={locale} />
    </div>
  );
};

export default page;
