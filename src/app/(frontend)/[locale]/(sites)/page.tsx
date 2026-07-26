import Video from "@/components/shared/Video/Video";
import Header from "@/components/ui/Header/Header";
import GetAllData from "@/actions/GetAllData";
import SubscripeSection from "@/components/ui/home/SubscripeSection/SubscripeSection";
import BlogSection from "@/components/ui/home/BlogSection/BlogSection";
import GetDataServerSide from "@/actions/GetDataServerSide";
import HomePageClient from "@/components/ui/home/HomePageClient";
import { getUser } from "@/actions/getUser";
type Props = {
  params: Promise<{
    locale: string;
  }>;
};

interface Product {
  id: number;
  title: string;
  important: boolean;
  isNew: boolean;
  ShowInDiscountSection: boolean;
  isBestSeller: boolean;
  isFavorite?: boolean;
}

interface Note {
  id: number;
  isImportant: boolean;
}
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const user = await getUser();

  const [Categories, products, Blogs, Notes, userFavorites] = await Promise.all(
    [
      GetAllData("categories"),
      GetAllData("products"),
      GetAllData("blogs"),
      GetAllData("Notes"),
      user
        ? GetDataServerSide("favorites?depth=1", "GET")
        : Promise.resolve(null),
    ],
  );

  const favoriteIds = new Set(
    Array.isArray(userFavorites?.docs)
      ? userFavorites.docs
          .map((doc: any) => doc?.product?.id ?? doc?.product)
          .filter(Boolean)
      : [],
  );

  const productsWithFavorites = products.map((pro: Product) => ({
    ...pro,
    isFavorite: favoriteIds.has(pro.id),
  }));

  const CategoriesReversed = [...Categories].reverse();
  const importantNotes = Notes.filter((note: Note) => note.isImportant);

  return (
    <main className="h-full">
      <div className="relative w-full min-h-screen">
        <div className="absolute inset-0 w-full h-full object-cover z-0">
          <Video
            src="https://res.cloudinary.com/dnszjyuxi/video/upload/v1773676530/Coffe1_tlxjvt.mp4"
            linear={true}
            rounded=""
          />
        </div>
      </div>
      <Header locale={locale} />

      <HomePageClient
        initialProducts={productsWithFavorites}
        categories={CategoriesReversed}
        locale={locale}
        blogs={Blogs}
      />

      <SubscripeSection locale={locale} />
      <BlogSection locale={locale} data={importantNotes} />
    </main>
  );
}
