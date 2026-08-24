"use client";
import React, { useTransition, useState } from "react";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import NotesSkelaton from "./NotesSkelaton";
import NotesCard from "./NotesCard";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
const NotesData = ({ data, locale, pagination }) => {
  const [isPending, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [notes, setNotes] = useState(data);
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 1);

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isPending) return;

    setIsLoadingPage(true);

    startTransition(async () => {
      try {
        const [result] = await Promise.all([
          GetDataWithPagination("/Notes", newPage, 6),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        setNotes(result.docs);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
      } finally {
        setIsLoadingPage(false);
      }
    });
  };

  return (
    <div className="w-full relative min-h-[300px] container">
      <h2 className="text-4xl text-center font-bold text-base-coffe mb-8">
        {locale === "en" ? "Notes" : "المدونات"}
      </h2>

      {isLoadingPage ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <NotesSkelaton key={index} />
          ))}
        </div>
      ) : (
        <GridSwiper
          filteredProducts={notes}
          enablePagePagination={true}
          makeBulletsWhilePagePagination={true}
          totalPages={totalPages}
          errorMessage={
            locale === "en" ? "No Blogs Was Found" : "لم يتم العثور على مدونات"
          }
          currentPage={currentPage}
          onPageChange={handlePageChange}
          renderItem={(item) => <NotesCard item={item} locale={locale} />}
        />
      )}
    </div>
  );
};

export default NotesData;
