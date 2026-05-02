'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from './ProductsCard'
import GridSwiper from '@/components/shared/Swiper/GridSwiper'

const HightLightedProducts = ({ categories, products }) => {
  let { locale } = useParams()

  const allCategories = [
    { id: 'all', title: 'All Products', titleAr: 'كل المنتجات' },
    ...categories,
  ]
  const [active, setActive] = useState('all')
  const filteredProducts = products.filter((product) => {
    if (active === 'all') return true
    const categoryName = categories.find((c) => c.id === active)?.title
    return product.category.title === categoryName
  })
  return (
    <div className="w-full md:max-w-7xl md:mx-auto flex flex-col text-base-light relative p-4 justify-center items-center">
      <div className="flex md:flex-row  justify-start flex-col md:justify-between w-full gap-4 items-center">
        <div className="flex justify-start md:justify-center items-center flex-wrap font-semibold gap-4">
          {allCategories.map((cat) => {
            const isActive = active === cat.id

            return (
              <div
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className="relative cursor-pointer group"
              >
                <span
                  className={`
                    relative pb-1
                    ${isActive ? 'after:w-full' : 'after:w-0'} after:content-[''] after:absolute after:left-0 after:bottom-0  after:h-px  after:bg-base-light after:transition-all after:duration-300 group-hover:after:w-full text-lg
                  `}
                >
                  {locale === 'en' ? cat.title : cat.titleAr}
                </span>
              </div>
            )
          })}
        </div>

        <div className="group inline-block">
          <Link
            href={`/${locale}/products`}
            className="
            font-semibold relative pb-1 text-lg after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-base-light after:transition-all after:duration-300 hover:after:bg-base-coffe"
          >
            {locale === 'en' ? 'Show Products' : 'عرض المنتجات'}
          </Link>
        </div>
      </div>
      <div className="w-full">
        <GridSwiper
          filteredProducts={filteredProducts}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1, grid: { rows: 1 } },
            640: { slidesPerView: 2, grid: { rows: 2 } },
            768: { slidesPerView: 2, grid: { rows: 2 } },
            1024: { slidesPerView: 3, grid: { rows: 2 } },
          }}
          renderItem={(product) => <ProductCard product={product} locale={locale} />}
        />
      </div>
    </div>
  )
}

export default HightLightedProducts
