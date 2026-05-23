'use client'

import React from 'react'
import NormalSwiper from '@/components/shared/Swiper/NormalSwiper'
import Image from 'next/image'

const Partners = ({ locale, title, fresh, freshSpan, partners }) => {
  const defaultBreakpoints = {
    0: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }
  const slides = Array.from({ length: 12 }, () => '/assets/Coffee_dark.webp')
  return (
    <section className="w-full md:mt-22 flex flex-col text-base-light relative p-4 justify-center items-center">
      <div className="flex flex-col md:flex-row w-full md:justify-center items-start md:items-center gap-10">
        <div className="flex flex-col justify-center ">
          <p
            className={`text-lg ${locale === 'en' ? 'text-left' : 'text-right'} lg:text-xl font-bold tracking-tighter`}
          >
            {title}
          </p>
          <div className="CoffeDiscription">
            <p className="font-bold">{fresh} </p>
            <span className="font-semibold">{freshSpan}</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center gap-2 overflow-hidden">
          <p
            className={`uppercase font-semibold text-lg ${locale === 'en' ? 'text-left' : 'text-right'} `}
          >
            {partners}
          </p>
          <div className="flex justify-center">
            <NormalSwiper
              breakpoints={defaultBreakpoints}
              px="px-12"
              data={slides}
              ItemComponent={({ item, index }) => (
                <Image src={item} alt={`img-${index}`} width={100} height={100} />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
