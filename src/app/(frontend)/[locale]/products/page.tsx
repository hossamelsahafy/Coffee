import React from "react";
import GetAllData from "@/actions/GetAllData";
type Props = {
  params: {
    locale: string;
  };
};
const page = async ({ params }: Props) => {
  const { locale } = await params;
  const product = await GetAllData("products");

  return <div className="container-custom mt-20">Page</div>;
};

export default page;
