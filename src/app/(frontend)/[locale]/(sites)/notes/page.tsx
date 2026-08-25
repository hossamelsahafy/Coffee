import type { Metadata } from "next";

import GetDataWithPagination from "@/actions/GetDataWithPagination";
import Header from "@/components/shared/Headers/Header";
import NotesData from "@/components/ui/Notes/NotesData";

import { getDataCache } from "@/lib/GetDataCache";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const Notes = await GetDataWithPagination("/Notes", 1, 6);

  const NotesGlobalData = await getDataCache("globals/notes-page");

  const isArabic = locale === "ar";

  const title = isArabic ? NotesGlobalData?.titleAr : NotesGlobalData?.titleEn;

  const des = isArabic
    ? NotesGlobalData?.descriptionAr
    : NotesGlobalData?.descriptionEn;

  const backToHome = isArabic ? "الرجوع للصفحة الرئيسية" : "Back To Home";

  const NotesDataList = Notes.docs;

  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={title}
          des={des}
          backToHome={backToHome}
          locale={locale}
          length={false}
        />
      </div>

      <div className="border-t border-base-nav w-full" />

      <div className="w-full h-auto">
        <NotesData
          data={NotesDataList}
          locale={locale}
          pagination={{
            page: Notes.page,
            totalPages: Notes.totalPages,
            hasNextPage: Notes.hasNextPage,
            hasPrevPage: Notes.hasPrevPage,
            totalDocs: Notes.totalDocs,
          }}
        />
      </div>
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const NotesGlobalData = await getDataCache("globals/notes-page");

  const isArabic = locale === "ar";

  const title = isArabic
    ? NotesGlobalData?.SEO?.metaTitleAr
    : NotesGlobalData?.SEO?.metaTitle;

  const description = isArabic
    ? NotesGlobalData?.SEO?.metaDescriptionAr
    : NotesGlobalData?.SEO?.metaDescription;

  const keywords = (
    isArabic ? NotesGlobalData?.SEO?.keywordsAr : NotesGlobalData?.SEO?.keywords
  )?.map((item: { keyword: string }) => item.keyword);

  const image =
    NotesGlobalData?.SEO?.ImageSource === "Url"
      ? NotesGlobalData?.SEO?.ImageUrl
      : NotesGlobalData?.SEO?.ImageUpload?.url;

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      type: "website",
      ...(image ? { images: [image] } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
