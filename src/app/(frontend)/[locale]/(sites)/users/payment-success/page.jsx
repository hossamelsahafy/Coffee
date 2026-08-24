import React from "react";
import SuccessPage from "@/components/ui/SuccessPage/SuccessPage";
const page = async ({ params }) => {
  const { locale } = await params;
  return (
    <div className="mt-28 w-full p-4 border-t border-base-border">
      <SuccessPage locale={locale} />
    </div>
  );
};

export default page;
