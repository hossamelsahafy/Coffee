import Video from "@/components/shared/Video/Video";
import Header from "@/components/ui/Header/Header";
import HighLightedProducts from "@/components/ui/home/Products/HightLightedProducts";
import GetAllData from "@/actions/GetAllData";
import HeaderTwo from "@/components/ui/Header/HeaderTwo";
import BlogsSection from "@/components/ui/home/Reviews/BlogsSection";
import DiscountSection from "@/components/ui/home/DiscountProducts/DisCountSection";
import BestSellingSection from "@/components/ui/home/BestSells/BestSellingSection";
import SubscripeSection from "@/components/ui/home/SubscripeSection/SubscripeSection";
import BlogSection from "@/components/ui/home/BlogSection/BlogSection";

type Props = {
  params: {
    locale: string;
  };
};
export default async function Home({ params }: Props) {
  const { locale } = await params;
  interface Product {
    id: number;
    title: string;
    important: boolean;
    isNew: boolean;
    ShowInDiscountSection: boolean;
    isBestSeller: boolean;
  }
  interface Note {
    id: number;
    isImportant: boolean;
  }

  const Categories = await GetAllData("categories");
  const products = await GetAllData("products");
  const Blogs = await GetAllData("blogs");
  const Notes = await GetAllData("Notes");

  const CategoriesReversed = Categories.reverse();
  const importantProducts = products.filter((pro: Product) => pro.important);
  const disCountProducts = products.filter(
    (pro: Product) => pro.ShowInDiscountSection,
  );
  const bestSelling = products.filter((pro: Product) => pro.isBestSeller);
  const importantNotes = Notes.filter((note: Note) => note.isImportant);
  return (
    <main className="h-full">
      <div className="relative w-full min-h-screen">
        <div className="absolute inset-0 w-full h-full object-cover z-0">
          <Video
            src={
              "https://res.cloudinary.com/dnszjyuxi/video/upload/v1773676530/Coffe1_tlxjvt.mp4"
            }
            linear={true}
            rounded={""}
          />
        </div>
      </div>
      <Header locale={locale} />
      <HighLightedProducts
        categories={CategoriesReversed}
        products={products}
      />
      <HeaderTwo
        importantProducts={importantProducts}
        src={
          "https://res.cloudinary.com/dnszjyuxi/video/upload/v1773676563/Coffe2_igrxsq.mp4"
        }
      />
      <BlogsSection Blogs={Blogs} />
      <DiscountSection data={disCountProducts} />
      <BestSellingSection data={bestSelling} locale={locale} />
      <SubscripeSection locale={locale} />
      <BlogSection locale={locale} data={importantNotes} />
    </main>
  );
}
