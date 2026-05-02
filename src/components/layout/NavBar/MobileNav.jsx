'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import LocaleSwitcher from '@/components/shared/Buttons/LocaleSwitcher'
import DropDown from '@/components/shared/dropMenue/DropMenu'
import CartButton from '@/components/ui/CartButton/CartButton'
const MobileNav = ({
  locale,
  navLinks,
  menuOpen,
  setMenuOpen,
  otherLocale,
  item,
  localesData,
  currency,
  currenciesData,
  onChangecurrency,
  icons,
}) => {
  const [buttonsOpen, setButtonsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setButtonsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [menuOpen])

  return (
    <div className="w-full flex items-center justify-between gap-5 p-4 bg-base-dark text-base-light overflow-hidden">
      <div className="flex">
        <img src="/assets/Logo.webp" className="w-24 object-contain" alt="Logo" />
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="flex gap-2">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="border border-white p-1 rounded-full flex items-center justify-center"
            >
              <Link href={Icon.href}>
                <Icon.name className="text-xl" />
              </Link>
            </div>
          ))}
        </div>
        <CartButton itemslength={1} item={item} />
        <button onClick={() => setMenuOpen(!menuOpen)} className="z-50">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        ref={ref}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`
    fixed top-0 h-full z-40 bg-base-dark flex flex-col px-4 overflow-hidden transform transition-transform duration-700 ease-in-out
    w-full
    ${locale === 'ar' ? 'right-0' : 'left-0'}
    ${
      menuOpen
        ? 'translate-x-0 opacity-100'
        : locale === 'en'
          ? 'translate-x-full opacity-0 pointer-events-none transition-all duration-300'
          : '-translate-x-full opacity-0 pointer-events-none transition-all duration-300'
    }
  `}
      >
        <img src="/assets/Logo.webp" className="w-28 object-contain mt-8 mb-6" alt="Logo" />

        <div className="flex flex-col justify-start gap-4 p-4 ">
          <div className="flex justify-center w-full gap-4 items-center mt-6 mb-8">
            <LocaleSwitcher locale={locale} otherLocale={otherLocale} localesData={localesData} />
            <DropDown
              selectedValue={currency}
              options={currenciesData}
              onChange={onChangecurrency}
            />
          </div>
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <DropDown
                  key={link.id}
                  label={link.name}
                  options={link.children}
                  isLink
                  locale={locale}
                />
              )
            }

            return (
              <Link
                key={link.id}
                href={`${locale}/${link.href}`}
                className={`
        w-11/12 
        ${locale === 'ar' ? 'text-right' : 'text-left'}
        text-lg font-semibold
        hover:text-base-dark hover:bg-base-light
        px-4 py-2 rounded transition-colors duration-150
      `}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileNav
