"use client";
import { useState } from "react";
import { FiChevronsDown } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
const ProductCard = ({
  product,
  locale,
  bg,
  setSelectedProduct,
  setOpenModel,
}) => {
  const options = product.choices.options;

  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <>
      <div
        className={`${bg ? "backdrop-blur-sm bg-forTra" : "bg-highlightedProductsbg"} flex md:flex-row flex-col justify-center w-full gap-4 p-4 rounded-lg h-full min-h-25 min-w-0`}
      >
        <div className="flex justify-center w-full relative gap-4 w-full">
          <div className="flex justify-between items-center">
            <Image
              src={
                selectedOption.ImageSource === "Url"
                  ? selectedOption.imageUrl
                  : selectedOption.image.url
              }
              alt={locale === "en" ? product.title : product.titleAr}
              width={200}
              height={200}
              className="object-contain md:object-cover rounded-lg"
            />
          </div>
          <div>
            <div
              className={`absolute top-0 ${locale === "ar" ? "left-0 " : "right-0"} text-2xl md:text-lg font-semibold gap-2`}
            >
              <button className="cursor-pointer block">
                <CiHeart className="mb-2" />
              </button>
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProduct?.(product);
                  setOpenModel?.(true);
                }}
              >
                <IoEyeOutline />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-0  w-full">
          <Link
            href={`${locale}/products/${locale === "en" ? product.slug : product.slugAr}`}
          >
            <p className="font-semiboldtext-lg overflow-hidden">
              {locale === "en" ? product.subtitle : product.subtitleAr}
            </p>
            <p className="text-coffeText font-bold line-clamp-1 whitespace-nowrap overflow-hidden">
              {locale === "en" ? product.title : product.titleAr}
            </p>
            <p className="whitespace-nowrap overflow-hidden">
              {locale === "en" ? product.type : product.typeAr}
            </p>
          </Link>
          <div className="relative w-full">
            <select
              value={selectedOption.value || selectedOption.en}
              onChange={(e) =>
                setSelectedOption(
                  options.find(
                    (opt) => (opt.value || opt.en) === e.target.value,
                  ),
                )
              }
              className="w-full flex justify-between items-center bg-inherit text-base-light border px-3 py-2 rounded-lg cursor-pointer appearance-none"
            >
              {options.map((opt, idx) => (
                <option
                  className="text-base-dark"
                  key={idx}
                  value={opt.value || opt.en}
                >
                  {locale === "en"
                    ? opt.value || opt.en
                    : opt.ar || opt.valueAr}
                </option>
              ))}
            </select>
            <FiChevronsDown
              className={`absolute ${locale === "en" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 pointer-events-none text-base-light scale-x-150`}
            />
          </div>

          <div className="flex gap-8 justify-between items-center w-full">
            <div className="flex font-bold flex-col items-center min-w-0">
              <p className="whitespace-nowrap  sm:text-sm lg:text-base">
                {selectedOption.priceBefore || product.priceAfter} USD
              </p>
              <p
                className="relative text-gray-400 whitespace-nowrap  sm:text-sm lg:text-base
              before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t-2 before:border-gray-400"
              >
                {selectedOption.priceBefore || product.priceBefore} USD
              </p>
            </div>

            <button
              className="relative pb-1 whitespace-nowrap
            after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full 
            after:bg-base-light after:transition-all after:duration-300 sm:text-sm lg:text-base
            hover:after:bg-base-coffe cursor-pointer uppercase flex items-center font-bold"
            >
              <FiPlus />
              {locale === "en" ? "add to cart" : "اضف للسلة"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductCard;
