import React from "react";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import GetAllData from "@/actions/GetAllData";
import Header from "@/components/shared/Headers/Header";
import NotesData from "@/components/ui/Notes/NotesData";
const page = async ({ params }) => {
  const { locale } = await params;
  const Notes = await GetDataWithPagination("/Notes", 1, 6);

  const NotesGlobalData = await GetAllData("globals/notes-page", true);
  const title = NotesGlobalData.titleEn;
  const titleAr = NotesGlobalData.titleAr;
  const des = NotesGlobalData.descriptionEn;
  const desAr = NotesGlobalData.descriptionAr;

  const backToHome =
    locale === "en" ? "Back To Home" : "الرجوع للصفحة الرئيسية";
  const NoesData = Notes.docs;
  return (
    <div className="border-t mt-28 border-base-border w-full">
      <div className="container-custom p-4 mt-10">
        <Header
          title={locale === "en" ? title : titleAr}
          des={locale === "en" ? des : desAr}
          backToHome={backToHome}
          locale={locale}
        />
      </div>
      <div className="border-t border-base-nav w-full" />
      <div className="w-full h-auto">
        <NotesData
          data={NoesData}
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

export default page;
