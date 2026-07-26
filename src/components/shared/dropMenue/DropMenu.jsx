'use client'
import { useState, useRef, useEffect } from 'react'
import { LuChevronsDown } from 'react-icons/lu'
import Image from 'next/image'
import Link from 'next/link'

const DropDown = ({
  selectedValue,
  options = [],
  onChange,
  isLink = false,
  locale,
  label,
  style,
  variant,
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentOption = options.find((o) => o.value === selectedValue) || {}

  return (
    <div
      ref={ref}
      className="relative w-full lg:w-auto"
      onMouseEnter={() => variant === 'nav' && setOpen(true)}
      onMouseLeave={() => variant === 'nav' && setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={
          variant === 'nav'
            ? `
      text-lg font-bold text-base-light
      flex items-center gap-1
      cursor-pointer
    `
            : `

          flex items-center justify-between gap-2
          w-full p-2
          ${style !== 'nav' ? 'bg-base-light text-base-dark rounded-full shadow-sm' : 'font-bold'}
          `
        }
      >
        {isLink ? (
          <span>{label}</span>
        ) : (
          <div className="flex items-center gap-2">
            {currentOption.flag && (
              <Image src={currentOption.flag} alt={currentOption.label} width={20} height={20} />
            )}
            <span>{currentOption.value}</span>
          </div>
        )}

        <LuChevronsDown className={`transition text-base-coffe ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`
  absolute z-40
  ${variant === 'nav' ? 'top-full pt-2 min-w-40' : 'w-full mt-1'}
  ${locale === 'ar' ? 'right-0' : 'left-0'}

  bg-base-light text-base-dark rounded-lg shadow-sm overflow-hidden
  
  transform transition-all duration-300 ease-in-out
  
  ${open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}
`}
      >
        {' '}
        {options.map((option) => {
          if (isLink) {
            return (
              <Link
                key={option.id}
                href={`${locale}/${option.href}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 hover:bg-base-coffe/10"
              >
                {option.name}
              </Link>
            )
          }

          const isActive = option.value === selectedValue

          return (
            <button
              key={option.value}
              onClick={() => {
                if (!isActive) onChange(option.value)
                setOpen(false)
              }}
              disabled={isActive}
              className={`
                  w-full px-4 py-2 flex items-center gap-2
                  ${isActive ? 'bg-base-coffe/20' : 'hover:bg-base-coffe/10'}
                `}
            >
              {option.flag && <Image src={option.flag} alt={option.label} width={20} height={20} />}
              <span>{option.value}</span>
              {option.symbol && <span>{option.symbol}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DropDown
