import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import FormSection from './FormSection'
const SubscripeSection = ({ locale }) => {
  const t = useTranslations('supscripe')
  const subscripeText = t('subscripe')
  const placeholder = t('placeholder')
  return (
    <div className="relative container-custom my-4">
      <div className="relative w-full h-75 rounded-2xl overflow-hidden">
        <Image
          src="/assets/Subscribe-banner.webp"
          alt="subscribe banner"
          fill
          className={`object-cover ${locale === 'ar' ? 'scale-x-[-1]' : ''}`}
          priority
        />
      </div>
      <div className="absolute flex flex-col gap-4 inset-0 text-start w-full justify-center items-start p-6">
        <p className="Coffetitle">{t('coffee')}</p>
        <span>
          <p className="text-2xl font-semibold">{t('subscribeNewsletter')}</p>
          <p className="CoffeDiscription font-bold">{t('discountOffer')}</p>
        </span>
        <p className="w-full md:max-w-lg text-base font-semibold">{t('coffeeDescription')}</p>
        <FormSection SubscripeText={subscripeText} placeholder={placeholder} locale={locale} />
      </div>
    </div>
  )
}

export default SubscripeSection
