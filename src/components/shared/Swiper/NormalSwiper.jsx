'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const NormalSwiper = ({ data, ItemComponent, px, breakpoints, locale }) => {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [swiperInstance, setSwiperInstance] = useState(null)

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current
      swiperInstance.params.navigation.nextEl = nextRef.current
      swiperInstance.navigation.destroy()
      swiperInstance.navigation.init()
      swiperInstance.navigation.update()
    }
  }, [swiperInstance])

  return (
    <div className="relative w-full p-4">
      <div
        ref={prevRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-0.5 border-white border bg-base-coffe rounded-lg cursor-pointer flex items-center justify-center shadow-md"
      >
        <FiChevronsLeft size={24} />
      </div>

      <div className={px}>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={breakpoints}
          modules={[Navigation, Autoplay]}
          onSwiper={setSwiperInstance}
          className="w-full"
        >
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <ItemComponent item={item} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        ref={nextRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-0.5 border-white border bg-base-coffe rounded-lg cursor-pointer flex items-center justify-center shadow-md"
      >
        <FiChevronsRight size={24} />
      </div>
    </div>
  )
}

export default NormalSwiper
