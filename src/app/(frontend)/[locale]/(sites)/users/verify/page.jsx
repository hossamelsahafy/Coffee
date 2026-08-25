import React from "react";
import VerifyPage from "@/components/ui/VerifyPage/VerifyPage";
const page = () => {
  return (
    <div>
      <VerifyPage />
    </div>
  );
};

export default page;
export async function generateMetadata({ params }) {
  const { locale } = await params;

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "تاكيد الاميل" : "Verify}",

    robots: {
      index: false,
      follow: false,
    },
  };
}
