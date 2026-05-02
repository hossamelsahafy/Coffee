'use client'
import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'
import { CiYoutube } from 'react-icons/ci'
import { LuMessageCircleMore } from 'react-icons/lu'
import { FaXTwitter } from 'react-icons/fa6'
import { CiInstagram } from 'react-icons/ci'
import Link from 'next/link'

const Footer = ({ locale }) => {
  const t = useTranslations('footer')

  const shopLinks = t.raw('shopLinks') || []
  const accountLinks = t.raw('accountLinks') || []
  const shareIcons = [
    { icon: CiYoutube, href: '#' },
    { icon: LuMessageCircleMore, href: '#' },
    { icon: FaXTwitter, href: '#' },
    { icon: CiInstagram, href: '#' },
  ]
  const paymentIcons = [
    { icon: '/assets/visa.png' },
    { icon: '/assets/paypal.png' },
    { icon: '/assets/card.png' },
    { icon: '/assets/paypal.png' },
    { icon: '/assets/card.png' },
  ]

  return (
    <div className="relative border-base-border text-base-light border-t w-full flex flex-col gap-5 p-5 md:p-4">
      <div className="relative flex flex-col md:flex-row z-10 justify-between flex-wrap gap-5 w-full">
        <div className="hidden lg:block">
          <Image width={150} height={150} alt="left image" src={'/assets/left.webp'} />
        </div>

        <div className="flex flex-col justify-center w-full lg:max-w-102.5 mt-5 lg:mt-20 items-start gap-2">
          <Image
            width={70}
            height={70}
            alt="Coffee"
            src={'/assets/Coffee_dark.webp'}
            className="object-contain"
          />
          <p className="text-3xl font-semibold text-base-light">{t('coffeeCup')}</p>
          <span className="text-3xl font-semibold text-base-coffe">{t('momentOfTime')}</span>
          <span className="mt-4 text-base font-semibold text-base-light w-full leading-relaxed">
            {t('coffeeMarketText')}
          </span>
        </div>

        <div className="flex flex-col mt-5 lg:mt-20 gap-2">
          <span className="font-bold text-2xl">{t('shop')} :</span>
          <ul className="flex flex-col gap-2">
            {shopLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} className="hover:text-base-coffe transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col mt-5 lg:mt-20 gap-2">
          <span className="font-bold text-2xl">{t('account')} :</span>
          <ul className="flex flex-col gap-2">
            {accountLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} className="hover:text-base-coffe transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col mt-5 md:mx-4 lg:mt-20 gap-2">
          <span className="font-bold text-2xl">{t('share')} :</span>
          <div className="flex flex-row gap-4">
            {shareIcons.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-base-light rounded-lg hover:opacity-80 transition-opacity"
              >
                <link.icon className="w-4 h-4 text-base-dark" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex relative z-10 gap-2 lg:mx-16">
        <div className="flex md:flex-row flex-col w-full justify-between gap-2  lg:justify-around">
          <p className="text-base font-semibold text-base-light">
            &copy; {new Date().getFullYear()} • Powered by Me • All rights reserved
          </p>
          <div className="flex gap-2 ">
            {paymentIcons.map((icon, index) => (
              <Image
                key={index}
                src={icon.icon}
                alt="icon"
                width={30}
                height={30}
                className="object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 md:bottom-6 ${locale === 'en' ? 'right-0' : 'left-0'} w-90 h-90 lg:h-full pointer-events-none z-0`}
      >
        <Image src="/assets/footer-right.webp" alt="right image" fill className="object-contain" />
      </div>
    </div>
  )
}

export default Footer
