"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import GetReviewsByCountry from "@/actions/GetReviews";

import "swiper/css";
import "swiper/css/pagination";

import ReviewCard from "./ReviewCard";
import CoffeeLoader from "@/components/shared/loader/CoffeeLoader";

const ReviewsSectionClient = ({
  filteredReviews,
  initialTotalPages,
  initialHasNextPage,
  countryId,
  locale,
}) => {
  const [reviews, setReviews] = useState(filteredReviews || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [hasMore, setHasMore] = useState(initialHasNextPage ?? true);
  const [loading, setLoading] = useState(false);

  const swiperRef = useRef(null);

  useEffect(() => {
    setReviews(filteredReviews || []);
    setPage(1);
    setTotalPages(initialTotalPages || 1);
    setHasMore(initialHasNextPage ?? true);

    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0, 0);
    }
  }, [countryId, filteredReviews, initialTotalPages, initialHasNextPage]);

  const fetchPage = async (targetPage) => {
    if (loading || targetPage > totalPages) return;

    setLoading(true);

    try {
      const result = await GetReviewsByCountry({
        countryId,
        page: targetPage,
        limit: 2,
      });

      const newReviews = result?.docs || [];

      if (newReviews.length > 0) {
        setReviews((prev) => {
          const combined = [...prev, ...newReviews];
          const unique = Array.from(
            new Map(combined.map((item) => [item.id, item])).values(),
          );
          return unique;
        });
        setPage(targetPage);
        setTotalPages(result?.totalPages || totalPages);
        setHasMore(result?.hasNextPage ?? false);
      }
    } catch (error) {
      console.error("Failed to fetch page reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const grouped = reviews.reduce((acc, _, i) => {
    if (i % 2 === 0) {
      acc.push(reviews.slice(i, i + 2));
    }
    return acc;
  }, []);

  if (!reviews.length)
    return <p className="text-sm text-gray-400">No reviews available.</p>;

  return (
    <div className="relative w-full pb-10">
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={20}
        watchOverflow={false}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        modules={[Pagination]}
        className="w-full h-auto pb-8"
        onSlideChange={(swiper) => {
          const targetPageIndex = swiper.activeIndex + 1;
          if (targetPageIndex > page && hasMore && !loading) {
            fetchPage(targetPageIndex);
          }
        }}
      >
        {grouped.map((pair, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col gap-4 min-h-[220px] justify-between">
              {pair.map((review) => (
                <ReviewCard key={review.id} review={review} locale={locale} />
              ))}
              {pair.length === 1 && (
                <div
                  aria-hidden="true"
                  className="invisible opacity-0 pointer-events-none"
                >
                  <ReviewCard review={pair[0]} locale={locale} />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}

        {totalPages > grouped.length && (
          <SwiperSlide key="loading-slide">
            <div className="min-h-[220px] flex items-center justify-center">
              <CoffeeLoader />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <div className="w-full flex items-center justify-center mt-6 z-10">
        <div className="custom-pagination flex gap-2 items-center justify-center [&>.swiper-pagination-bullet]:w-2.5 [&>.swiper-pagination-bullet]:h-2.5 [&>.swiper-pagination-bullet]:bg-gray-400 [&>.swiper-pagination-bullet]:opacity-50 [&>.swiper-pagination-bullet-active]:opacity-100 [&>.swiper-pagination-bullet-active]:bg-base-coffe transition-all" />
      </div>
    </div>
  );
};

export default ReviewsSectionClient;
