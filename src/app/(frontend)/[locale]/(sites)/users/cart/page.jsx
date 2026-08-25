import { redirect } from "next/navigation";
import CartPageHeader from "@/components/ui/CartPage/CartPageHeader";
import CartData from "@/components/ui/CartPage/CartDetails";
import { getUser } from "@/actions/getUser";

const Page = async ({ params }) => {
  const { locale } = await params;

  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/users/login`);
  }

  return (
    <div className="mt-28 w-full border-t border-base-border">
      <CartPageHeader />
      <CartData locale={locale} />
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const isArabic = locale === "ar";

  return {
    title: isArabic ? "سلة التسوق" : "Shopping Cart",

    robots: {
      index: false,
      follow: false,
    },
  };
}
