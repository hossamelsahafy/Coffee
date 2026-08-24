import React from "react";
import Link from "next/link";
import LocaleSwitcher from "@/components/shared/Buttons/LocaleSwitcher";
import Image from "next/image";
import CartButton from "@/components/ui/CartButton/CartButton";
import DropDown from "@/components/shared/dropMenue/DropMenu";

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
  itemslength,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-7xl p-4">
        <div className="flex h-20 w-full items-center justify-between gap-6">
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <Image
              alt="Coffee And Tea"
              src="/assets/Logo.png"
              width={200}
              height={200}
              priority
              className="h-auto w-20 object-contain sm:w-24 lg:w-28"
            />
          </Link>

          <nav className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:gap-5">
            <div className="flex items-center gap-3 lg:gap-5">
              {navLinks.map((link) => (
                <div key={link.id} className="relative group shrink-0">
                  <Link
                    href={`/${locale}/${link.href}`}
                    className="text-sm font-bold text-base-light transition-colors duration-300 lg:text-base xl:text-lg"
                  >
                    <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-base-light after:transition-all after:duration-300 group-hover:after:w-full">
                      {link.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {icons.map((Icon, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-full border border-white p-1"
                >
                  <Link href={`/${locale}${Icon.href}`}>
                    <Icon.name className="text-lg lg:text-xl" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="shrink-0">
              <LocaleSwitcher
                locale={locale}
                otherLocale={otherLocale}
                localesData={localesData}
              />
            </div>

            <div className="shrink-0">
              <DropDown
                selectedValue={currency}
                options={currenciesData}
                onChange={onChangecurrency}
              />
            </div>

            <div className="shrink-0">
              <Link href={`/${locale}/users/cart`}>
                <CartButton itemslength={itemslength} item={item} />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DesktopNav;
