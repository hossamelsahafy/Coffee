'use client'
import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const Links = ({ text, targetLink }) => {
  const { locale } = useParams()
  return (
    <div className="group inline-block">
      <Link
        href={`/${locale}/${targetLink}`}
        className="
            font-semibold relative pb-1 text-lg after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-base-light after:transition-all after:duration-300 hover:after:bg-base-coffe"
      >
        {text}
      </Link>
    </div>
  )
}

export default Links
