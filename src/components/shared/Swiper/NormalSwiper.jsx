"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

const NormalSwiper = ({
  data,
  ItemComponent,
  px,
  breakpoints,
  locale,
  changebg,
  slides,
  onSwiper,
  hidden,
  rounded,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="relative w-full p-4">
      <div
        ref={prevRef}
        className={`${hidden ? "hidden" : "absolute"} left-0 top-1/2 -translate-y-1/2 z-30 p-0.5 border-white border ${changebg ? "bg-base-dark" : "bg-base-coffe"} rounded-lg cursor-pointer flex items-center justify-center shadow-md`}
      >
        <FiChevronsLeft size={24} />
      </div>

      <div className={px}>
        <Swiper
          slidesPerView={slides || 4}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={breakpoints}
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            onSwiper?.(swiper);
          }}
          className="w-full"
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              {rounded ? (
                <div className="border border-base-border w-full p-2 rounded-lg shrink ">
                  <ItemComponent item={item} locale={locale} />
                </div>
              ) : (
                <ItemComponent item={item} locale={locale} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        ref={nextRef}
        className={`${hidden ? "hidden" : "absolute"} right-0 top-1/2 -translate-y-1/2 z-30 p-0.5 border-white border ${changebg ? "bg-base-dark" : "bg-base-coffe"} rounded-lg cursor-pointer flex items-center justify-center shadow-md`}
      >
        <FiChevronsRight size={24} />
      </div>
    </div>
  );
};

export default NormalSwiper;
