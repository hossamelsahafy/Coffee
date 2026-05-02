'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import Links from '@/components/shared/Links/Links'
import NormalSwiper from '@/components/shared/Swiper/NormalSwiper'
import ProductCard from '@/components/shared/Products/ProductsCardAsColomns'
const DisCountSection = ({ data }) => {
  const t = useTranslations('discountSection')
  const defaultBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
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

  return (
    <div className="container-custom">
      <div className="flex w-full md:flex-row flex-col md:justify-between items-center">
        <div className="flex flex-col gap-2">
          <p className="Coffetitle">{t('coffee')}</p>
          <p className="CoffeDiscription font-bold">{t('coffeeShopBestDiscountProducts')}</p>
        </div>
        <Links text={t('showMoreProducts')} />
      </div>
      <NormalSwiper
        breakpoints={defaultBreakpoints}
        px="px-0"
        data={data}
        ItemComponent={({ item }) => (
          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <ProductCard product={item} />
          </div>
        )}
      />
    </div>
  )
}

export default DisCountSection
