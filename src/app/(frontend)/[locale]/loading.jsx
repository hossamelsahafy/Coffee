import React from 'react'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <Image
        src="/assets/CoffeLoading.gif"
        alt="loading"
        width={100}
        height={100}
        unoptimized
        className="object-contain"
      />
    </div>
  )
}
