import React from "react";
import SuccessPage from "@/components/ui/SuccessPage/SuccessPage";
const page = async ({ params }) => {
  const { locale } = await params;
  return (
    <div className="flex flex-col mt-20 justify-center h-[50vh] items-center border-t border-base-border">
      <SuccessPage locale={locale} />
    </div>
  );
};

export default page;
