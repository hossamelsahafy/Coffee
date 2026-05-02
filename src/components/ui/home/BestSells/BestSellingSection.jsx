import React from 'react'
import { useTranslations } from 'next-intl'
import Links from '@/components/shared/Links/Links'
import Image from 'next/image'
import ProductCard from '../Products/ProductsCard'
const BestSellingSection = ({ data, locale }) => {
  const t = useTranslations('BestSeller')

  return (
    <div className="container-custom">
      <div className="flex md:flex-row gap-4 flex-col justify-between w-full items-center">
        <div className="flex flex-col justify-center gap-4 ">
          <p className="Coffetitle">{t('title')}</p>
          <p className="CoffeDiscription font-bold">{t('description')}</p>
          <p className="w-full md:max-w-sm text-base"> {t('longDescription')}</p>
          <Links text={t('showProducts')} targetLink={'products'} />
        </div>
        <div className="lg:w-75 lg:h-75 md:h-50 md:w-50 flex justify-center">
          <Image
            src={'/assets/Cup_of_Coffee.H03_1_x200.avif'}
            width={300}
            height={300}
            className="object-contain"
            alt="Coffee Image"
          />
        </div>
        <div className="flex w-full md:max-w-1/3">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BestSellingSection
