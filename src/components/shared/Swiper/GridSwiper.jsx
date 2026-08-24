"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import CoffeeLoader from "@/components/shared/loader/CoffeeLoader";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GridSwiper = ({
  filteredProducts = [],
  renderItem,
  bg,
  ChunkSize,
  sideBarIsOpen,
  PaddingBottom = "0px",
  breakpoints,
  enablePagePagination = false,
  makeBulletsWhilePagePagination = false,
  loop = false,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  rows = 2,
  skeletonCount = 6,
  errorMessage,
}) => {
  const { locale } = useParams();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const isExternalChangeRef = useRef(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pairedColumns = useMemo(() => {
    if (enablePagePagination || rows === 1) return [];
    const pairs = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      pairs.push(filteredProducts.slice(i, i + 2));
    }
    return pairs;
  }, [filteredProducts, enablePagePagination, rows]);

  if (!mounted) return null;

  const activeBreakpoints = breakpoints || {
    0: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };

  const maxSlidesPerView = Math.max(
    ...Object.values(activeBreakpoints).map((bp) => bp.slidesPerView || 1),
  );

  const totalSlides = enablePagePagination
    ? totalPages
    : rows === 1
      ? filteredProducts.length
      : pairedColumns.length;

  const showControls = enablePagePagination
    ? totalPages > 1
    : totalSlides > maxSlidesPerView;

  const showBlockLoader =
    isLoading && (!enablePagePagination || makeBulletsWhilePagePagination);

  return (
    <div ref={containerRef} className="relative w-full p-4 pb-16 scroll-mt-6">
      {!enablePagePagination && showControls && (
        <div
          ref={prevRef}
          className="hidden absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe text-white rounded-lg cursor-pointer md:flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <FiChevronsLeft size={24} />
        </div>
      )}

      <div className="relative w-full">
        {filteredProducts.length === 0 && !isLoading ? (
          <div className="w-full text-center py-16 text-amber-950/70 font-medium">
            {errorMessage
              ? errorMessage
              : locale === "en"
                ? "No products found in this category."
                : "لم يتم العثور على منتجات في هذه المجموعة"}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full relative"
          >
            <div className="relative w-full">
              {showBlockLoader && (
                <div className="absolute inset-0 z-50 bg-black flex items-start md:items-center justify-center transition-opacity duration-200 p-4">
                  <CoffeeLoader />
                </div>
              )}

              <Swiper
                key={`swiper-${totalPages}-${enablePagePagination}`}
                modules={[Navigation, Autoplay, Pagination]}
                initialSlide={currentPage - 1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onBeforeInit={(swiper) => {
                  if (typeof swiper.params.navigation !== "boolean") {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                slidesPerView={enablePagePagination ? 1 : 3}
                spaceBetween={16}
                loop={loop}
                autoplay={
                  enablePagePagination
                    ? false
                    : { delay: 3000, disableOnInteraction: false }
                }
                observer={true}
                observeParents={true}
                onSlideChange={(swiper) => {
                  if (isExternalChangeRef.current) {
                    isExternalChangeRef.current = false;
                    return;
                  }
                  if (enablePagePagination && onPageChange) {
                    const newIndex = swiper.activeIndex + 1;
                    if (newIndex !== currentPage && newIndex <= totalPages) {
                      const targetElement =
                        document.getElementById("products-section");
                      targetElement?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                      onPageChange(newIndex);
                    }
                  }
                }}
                pagination={
                  showControls
                    ? {
                        clickable: true,
                        el: ".custom-swiper-pagination",
                        bulletClass:
                          enablePagePagination &&
                          !makeBulletsWhilePagePagination
                            ? "swiper-pagination-bullet custom-page-number-bullet"
                            : "swiper-pagination-bullet",
                        bulletActiveClass: "swiper-pagination-bullet-active",
                        renderBullet: (index, className) => {
                          const pageNum = index + 1;
                          if (
                            enablePagePagination &&
                            !makeBulletsWhilePagePagination
                          ) {
                            return `<span class="${className}">${pageNum}</span>`;
                          }
                          return `<span class="${className}" aria-label="Go to page ${pageNum}"></span>`;
                        },
                      }
                    : false
                }
                style={{
                  paddingBottom: PaddingBottom,
                }}
                breakpoints={
                  enablePagePagination ? undefined : activeBreakpoints
                }
                className={`w-full ${enablePagePagination ? "" : "mt-10"}`}
              >
                {enablePagePagination
                  ? Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentActivePage = pageNumber === currentPage;
                      return (
                        <SwiperSlide key={`server-page-${pageNumber}`}>
                          <div className="relative w-full min-h-[250px]">
                            <div
                              className={`grid ${
                                sideBarIsOpen
                                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                              } gap-6 w-full items-stretch`}
                            >
                              {isCurrentActivePage &&
                              isLoading &&
                              !makeBulletsWhilePagePagination
                                ? Array.from({ length: skeletonCount }).map(
                                    (_, sIdx) => (
                                      <div
                                        key={`skeleton-${sIdx}`}
                                        className="w-full h-[320px] bg-neutral-200/70 dark:bg-neutral-800/50 rounded-2xl animate-pulse p-4 flex flex-col justify-between"
                                      >
                                        <div className="w-full h-48 bg-neutral-300 dark:bg-neutral-700/60 rounded-xl" />
                                        <div className="space-y-2 mt-4">
                                          <div className="w-3/4 h-4 bg-neutral-300 dark:bg-neutral-700/60 rounded" />
                                          <div className="w-1/2 h-4 bg-neutral-300 dark:bg-neutral-700/60 rounded" />
                                        </div>
                                      </div>
                                    ),
                                  )
                                : isCurrentActivePage
                                  ? filteredProducts.map((product) => (
                                      <div key={product.id || product._id}>
                                        {renderItem(product)}
                                      </div>
                                    ))
                                  : null}
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })
                  : rows === 1
                    ? filteredProducts.map((product, i) => (
                        <SwiperSlide key={product.id || product._id || i}>
                          <div>{renderItem(product)}</div>
                        </SwiperSlide>
                      ))
                    : pairedColumns.map((pair, colIndex) => (
                        <SwiperSlide key={`col-${colIndex}`}>
                          <div className="flex flex-col gap-6 w-full">
                            {pair.map((product) => (
                              <div key={product.id || product._id}>
                                {renderItem(product)}
                              </div>
                            ))}
                          </div>
                        </SwiperSlide>
                      ))}
              </Swiper>
            </div>
          </motion.div>
        )}
      </div>

      {showControls && (
        <div className="custom-swiper-pagination w-full flex justify-center items-center gap-2 mt-6" />
      )}

      {!enablePagePagination && showControls && (
        <div
          ref={nextRef}
          className="hidden absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe text-white rounded-lg cursor-pointer md:flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <FiChevronsRight size={24} />
        </div>
      )}
    </div>
  );
};

export default GridSwiper;
