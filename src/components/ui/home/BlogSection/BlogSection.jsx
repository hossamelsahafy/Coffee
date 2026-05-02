'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import Links from '@/components/shared/Links/Links'
import Image from 'next/image'
import NormalSwiper from '@/components/shared/Swiper/NormalSwiper'
import NoteCards from './NoteCards'
const BlogSection = ({ locale, data }) => {
  const t = useTranslations('BlogSection')
  const defaultBreakpoints = {
    0: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  }
  return (
    <div className="container-custom">
      <div className="flex relative justify-between w-full md:flex-row flex-col items-start">
        <div className="flex min-w-1/3 flex-col justify-center gap-4">
          <p className="Coffetitle">{t('title')}</p>
          <p className="CoffeDiscription">{t('subtitle')}</p>
          <p className="w-full md:max-w-md text-base">{t('description')}</p>
          <Links text={t('cta')} targetLink={'blogs'} />
          <div className="hidden md:flex justify-end items-end">
            <Image
              src={'/assets/flying-coffee_o61m6u.png'}
              width={100}
              height={100}
              className="object-contain"
              alt="Coffee Image"
            />
          </div>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <NormalSwiper
            data={data}
            ItemComponent={NoteCards}
            locale={locale}
            px="px-0"
            breakpoints={defaultBreakpoints}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogSection
