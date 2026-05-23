"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Autoplay, Pagination } from "swiper/modules";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GridSwiper = ({
  filteredProducts,
  renderItem,
  bg,
  PaddingBottom = "0px",
  breakpoints,
  enablePagePagination = false,
  loop = false,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    setNavigationReady(true);
  }, []);

  const paginatedProducts = useMemo(() => {
    if (!enablePagePagination) return [];

    const chunkSize = 9;
    const chunks = [];

    for (let i = 0; i < filteredProducts.length; i += chunkSize) {
      chunks.push(filteredProducts.slice(i, i + chunkSize));
    }

    return chunks;
  }, [filteredProducts, enablePagePagination]);

  return (
    <div className="relative w-full p-4">
      {!enablePagePagination && (
        <div
          ref={prevRef}
          className="hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe rounded-lg cursor-pointer md:flex items-center justify-center shadow-md"
        >
          <FiChevronsLeft size={24} />
        </div>
      )}

      {navigationReady && (
        <>
          <Swiper
            modules={[Grid, Navigation, Autoplay, Pagination]}
            slidesPerView={enablePagePagination ? 1 : 3}
            grid={
              enablePagePagination
                ? undefined
                : {
                    rows: filteredProducts.length < 3 ? 1 : 2,
                    fill: "row",
                  }
            }
            spaceBetween={16}
            loop={loop}
            autoplay={
              enablePagePagination
                ? false
                : {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
            }
            navigation={
              enablePagePagination
                ? false
                : {
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }
            }
            pagination={{
              clickable: true,
              el: paginationRef.current,

              bulletClass: enablePagePagination
                ? "custom-page-bullet"
                : "swiper-pagination-bullet",

              bulletActiveClass: enablePagePagination
                ? "custom-page-bullet-active"
                : "swiper-pagination-bullet-active",

              renderBullet: enablePagePagination
                ? (index, className) => {
                    return `<span class="${className}">${index + 1}</span>`;
                  }
                : undefined,
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                if (paginationRef.current && swiper.pagination) {
                  swiper.params.pagination = {
                    ...swiper.params.pagination,
                    el: paginationRef.current,
                  };

                  swiper.pagination.init();
                  swiper.pagination.render();
                  swiper.pagination.update();
                }

                if (
                  !enablePagePagination &&
                  prevRef.current &&
                  nextRef.current &&
                  swiper.navigation
                ) {
                  swiper.params.navigation = {
                    ...swiper.params.navigation,
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  };

                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              });
            }}
            style={{
              paddingBottom: PaddingBottom,
            }}
            breakpoints={enablePagePagination ? undefined : breakpoints}
            className={`w-full  ${enablePagePagination ? "" : "mt-10"}`}
          >
            {enablePagePagination
              ? paginatedProducts.map((page, index) => (
                  <SwiperSlide key={index}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full items-stretch">
                      {" "}
                      {page.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            mass: 0.5,
                          }}
                        >
                          {renderItem(product)}
                        </motion.div>
                      ))}
                    </div>
                  </SwiperSlide>
                ))
              : filteredProducts.map((product, i) => (
                  <SwiperSlide key={i}>
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        mass: 0.5,
                      }}
                    >
                      {renderItem(product)}
                    </motion.div>
                  </SwiperSlide>
                ))}
          </Swiper>

          <div
            ref={paginationRef}
            className={`relative justify-center mt-5 ${
              enablePagePagination ? "flex" : "flex md:hidden"
            }`}
          />
        </>
      )}

      {!enablePagePagination && (
        <div
          ref={nextRef}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe rounded-lg cursor-pointer items-center justify-center shadow-md"
        >
          <FiChevronsRight size={24} />
        </div>
      )}
    </div>
  );
};

export default GridSwiper;
