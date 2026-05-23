import React from 'react'
import { useTranslations } from 'next-intl'
import TextAnimation from '@/components/ui/animation/TextAnimation'
import Partners from '@/components/ui/home/Partners/Partners'
const Header = ({ locale }) => {
  const currentDate = new Date()
  const t = useTranslations('header')
  const title = t('title')
  const fresh = t('fresh')
  const freshSpan = t('freshSpan')
  const partners = t('partners')
  return (
    <div className="absolute inset-0 w-full flex flex-col justify-center items-cenetr z-10 ">
      <div className="relative w-full h-auto p-4 text-base-light flex flex-col items-center justify-center text-center">
        <div
          className={`hidden md:flex flex-col items-center gap-4 absolute ${locale === 'en' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-2xl font-semibold`}
        >
          <p className="rotate-90">
            {currentDate.getDate()}/{currentDate.getMonth() + 1}
          </p>
          <div className="border-l my-2 border-white h-80" />
          <p className="rotate-90">{t('title')}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <TextAnimation locale={locale} />
        </div>
      </div>
      <Partners
        locale={locale}
        title={title}
        partners={partners}
        fresh={fresh}
        freshSpan={freshSpan}
      />
    </div>
  )
}

export default Header
