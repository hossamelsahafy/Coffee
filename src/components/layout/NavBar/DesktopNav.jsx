import React from 'react'
import { Tally1 } from 'lucide-react'
import Link from 'next/link'
import LocaleSwitcher from '@/components/shared/Buttons/LocaleSwitcher'
import Image from 'next/image'
import CartButton from '@/components/ui/CartButton/CartButton'
import DropDown from '@/components/shared/dropMenue/DropMenu'
const DesktopNav = ({
  locale,
  navLinks,
  otherLocale,
  localesData,
  item,
  currency,
  currenciesData,
  onChangecurrency,
  icons,
}) => {
  return (
    <div className="absolute inset-0 max-w-6xl mx-auto p-4 mt-4 text-base-light ">
      <div className="flex flex-row justify-between  w-full items-center">
        <Link href="/">
          <Image
            alt="Coffe"
            src="/assets/Logo.webp"
            className="w-24 object-contain"
            width={400}
            height={400}
          />
        </Link>
        <div className="flex gap-5 items-center">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div key={link.id} className="relative group">
                  <DropDown
                    label={link.name}
                    options={link.children}
                    isLink
                    locale={locale}
                    variant="nav"
                    style="nav"
                  />
                </div>
              )
            }

            return (
              <div key={link.id} className="relative group">
                <Link
                  href={`/${locale}/${link.href}`}
                  className="text-lg font-bold text-base-light transition-colors duration-300"
                >
                  <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-base-light after:transition-all after:duration-300 group-hover:after:w-full">
                    {link.name}
                  </span>
                </Link>
              </div>
            )
          })}
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
          <LocaleSwitcher locale={locale} otherLocale={otherLocale} localesData={localesData} />
          <DropDown selectedValue={currency} options={currenciesData} onChange={onChangecurrency} />
          <Link href={`${locale}/cart`}>
            <CartButton itemslength={1} item={item} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DesktopNav
