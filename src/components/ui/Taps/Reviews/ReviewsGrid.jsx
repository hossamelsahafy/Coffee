"use client";

import React, { useState } from "react";
import ReviewsCard from "@/components/ui/Taps/Reviews/ReviewsCard";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ReviewCardSkeleton from "./ReviewCardSkeleton";
import GetDataWithPagination from "@/actions/GetDataWithPagination"; // Adjust path if needed

export default function ReviewsGrid({
  initialData,
  initialPage = 1,
  locale,
  userId,
  openSidebar = false,
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (newPage) => {
    setIsLoading(true);
    try {
      const whereClause = userId
        ? {
            ClientName: {
              equals: userId,
            },
          }
        : {};

      const result = await GetDataWithPagination(
        "reviews",
        newPage,
        9,
        "-updatedAt",
        whereClause,
        true,
      );

      setData(result);
      setCurrentPage(newPage);
    } catch (error) {
      console.error("Failed to fetch page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 16 },
    700: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: openSidebar ? 2 : 3, spaceBetween: 24 },
  };

  const reviewsList = data?.docs || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="w-full">
      {isLoading ? (
        <div
          className={`grid grid-cols-1 ${
            openSidebar ? "md:grid-cols-2" : "md:grid-cols-3"
          } lg:grid-cols-3 gap-6 w-full pb-5`}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <GridSwiper
          filteredProducts={reviewsList}
          loop={false}
          enablePagePagination={true}
          makeBulletsWhilePagePagination={true}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          breakpoints={breakpoints}
          sideBarIsOpen={openSidebar}
          PaddingBottom="20px"
          errorMessage={
            locale === "en"
              ? "No Approved Reviews Found"
              : "لم يتم العثور على تقييمات معتمدة"
          }
          renderItem={(reviewData) => {
            return <ReviewsCard reviews={[reviewData]} locale={locale} />;
          }}
        />
      )}
    </div>
  );
}
