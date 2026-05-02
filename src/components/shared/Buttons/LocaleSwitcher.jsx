'use client'
import { useState, useRef, useEffect } from 'react'
import { LuChevronsDown } from 'react-icons/lu'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LocaleSwitcher = ({ locale, otherLocale, localesData }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const pathname = usePathname()
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <div ref={ref} className="relative text-center w-full lg:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className={`
    flex items-center justify-between gap-2
    w-full lg:w-30 p-2
    bg-base-light text-base-dark rounded-full shadow-sm
    transition-colors duration-150
    ${locale === 'ar' ? 'lg:flex-row-reverse' : ''}
  `}
      >
        <div className="flex items-center gap-2">
          <Image
            src={localesData[locale].flag}
            alt={locale}
            width={20}
            height={20}
            className="object-contain"
          />
          <span className="text-sm lg:text-base">{localesData[locale].label}</span>
        </div>

        <LuChevronsDown
          className={`
      text-base-coffe 
      w-5 h-5
      transition-transform duration-150 
      ${open ? 'rotate-180' : ''}
    `}
        />
      </button>

      {open && (
        <div className="absolute lg:right-0 w-full lg:w-30 bg-base-light text-base-dark rounded-lg shadow-sm mt-1 overflow-hidden">
          {[locale, otherLocale].map((lang) => {
            const isActive = lang === locale

            return (
              <Link key={lang} href={newPath}>
                <button
                  key={lang}
                  onClick={() => setOpen(false)}
                  className={`
            w-full px-4 py-2 flex items-center gap-2 justify-center lg:justify-start transition
            ${isActive ? 'opacity-90 bg-base-coffe/20' : 'hover:bg-base-coffe/10'}
          `}
                >
                  <Image
                    src={localesData[lang].flag}
                    alt={lang}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>{localesData[lang].label}</span>
                </button>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LocaleSwitcher
