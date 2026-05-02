'use client'

import { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Navigation, Autoplay, Pagination } from 'swiper/modules'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const GridSwiper = ({ filteredProducts, renderItem, bg, breakpoints, loop }) => {
  console.log(bg)

  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const paginationRef = useRef(null)
  const [navigationReady, setNavigationReady] = useState(false)

  useEffect(() => {
    setNavigationReady(true)
  }, [])

  return (
    <div className="relative w-full p-4">
      {/* Previous Button */}
      <div
        ref={prevRef}
        className="hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe rounded-lg cursor-pointer  md:flex items-center justify-center shadow-md"
      >
        <FiChevronsLeft size={24} />
      </div>

      {navigationReady && (
        <>
          <Swiper
            modules={[Grid, Navigation, Autoplay, Pagination]}
            slidesPerView={3}
            grid={{ rows: filteredProducts.length < 3 ? 1 : 2, fill: 'row' }}
            spaceBetween={16}
            loop={loop}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            onSwiper={(swiper) => {
              setTimeout(() => {
                if (paginationRef.current && swiper.pagination) {
                  swiper.params.pagination = {
                    ...swiper.params.pagination,
                    el: paginationRef.current,
                  }

                  swiper.pagination.init()
                  swiper.pagination.render()
                  swiper.pagination.update()
                }

                if (prevRef.current && nextRef.current && swiper.navigation) {
                  swiper.params.navigation = {
                    ...swiper.params.navigation,
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }

                  swiper.navigation.init()
                  swiper.navigation.update()
                }
              })
            }}
            breakpoints={breakpoints}
            className="w-full mt-10"
          >
            {filteredProducts.map((product, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
                >
                  {renderItem(product)}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            ref={paginationRef}
            className="relative flex justify-center mt-5 md:hidden"
          ></div>{' '}
        </>
      )}
      <div
        ref={nextRef}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 border-white border bg-base-coffe rounded-lg cursor-pointer items-center justify-center shadow-md"
      >
        <FiChevronsRight size={24} />
      </div>
    </div>
  )
}

export default GridSwiper
