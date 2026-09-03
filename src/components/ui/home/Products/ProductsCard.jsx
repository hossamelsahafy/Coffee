"use client";
import { useState } from "react";
import { FiChevronsDown } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/Context/CartContext";
import { useUser } from "@/Context/userContext";
import { CgSpinner } from "react-icons/cg";
import SlugMethods from "@/actions/SlugMethods";

const ProductCard = ({
  product,
  locale,
  bg,
  setSelectedProduct,
  setOpenModel,
  toggleFavorite,
  isLoading,
  onAddToCart,
  isFavorite,
}) => {
  const { addToCart } = useCart();
  const options = product?.choices?.options || [];
  const { user } = useUser();

  const getInitialOption = () => {
    return options.find((o) => o.availability === "inStock") || options[0];
  };

  const [selectedOption, setSelectedOption] = useState(getInitialOption);
  const [isFading, setIsFading] = useState(false);
  const isIn = selectedOption?.availability === "inStock";

  const getOptionKey = (opt) => {
    if (!opt) return "";
    const val = opt.value;
    if (typeof val === "object" && val !== null) {
      return val.id || val.name;
    }
    return val || opt.en || "";
  };

  const handleOptionChange = (newOption) => {
    if (!newOption || newOption === selectedOption) return;

    setIsFading(true);
    setTimeout(() => {
      setSelectedOption(newOption);
      setIsFading(false);
    }, 150);
  };

  const handleViewed = async () => {
    if (user) {
      try {
        await SlugMethods("auth/track-products", "POST", {
          productId: product.id,
        });
      } catch (error) {
        console.error("Failed to track product view:", error);
      }
    }
  };

  return (
    <>
      <div
        className={`${bg ? "backdrop-blur-sm bg-forTra" : "bg-highlightedProductsbg"} flex md:flex-row flex-col justify-center w-full gap-4 p-4 rounded-lg h-full min-h-25 min-w-0`}
      >
        <div className="flex justify-center w-full relative gap-4 ">
          <div className="flex justify-between items-center overflow-hidden">
            {selectedOption && (
              <Image
                src={
                  selectedOption.ImageSource === "Url"
                    ? selectedOption.imageUrl
                    : selectedOption.image?.url
                }
                alt={locale === "en" ? product.title : product.titleAr}
                width={200}
                height={200}
                className={`object-contain md:object-cover rounded-lg transition-opacity duration-300 ${
                  isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              />
            )}
          </div>
          <div>
            <div
              className={`absolute top-0 ${locale === "ar" ? "left-0 " : "right-0"} text-2xl md:text-lg font-semibold gap-2 z-10`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite();
                }}
                disabled={isLoading}
                aria-label="Toggle Favorite"
                className="cursor-pointer block my-2 disabled:cursor-wait items-center"
              >
                {isLoading ? (
                  <CgSpinner className="text-sm animate-spin text-base-lighter" />
                ) : isFavorite ? (
                  <FaHeart className="text-sm text-base-lighter" />
                ) : (
                  <FaRegHeart className="text-sm text-base-light" />
                )}
              </button>
              <button
                className="cursor-pointer items-center"
                aria-label="View Product"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleViewed();
                  setSelectedProduct?.(product);
                  setOpenModel?.(true);
                }}
              >
                <IoEyeOutline className="text-base text-base-light" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-0 w-full">
          <Link
            onClick={() => handleViewed()}
            href={`/${locale}/products/${locale === "en" ? product.slug : product.slugAr}`}
          >
            <p className="text-coffeText font-bold line-clamp-1 mwhitespace-nowrap overflow-hidden">
              {locale === "en" ? product.title : product.titleAr}
            </p>
            <p className="font-semibold text-lg overflow-hidden line-clamp-1">
              {locale === "en" ? product.subtitle : product.subtitleAr}
            </p>
            <p className="whitespace-nowrap overflow-hidden">
              {locale === "en"
                ? product.BrandName?.name
                : product.BrandName?.nameAr}
            </p>
          </Link>
          <div className="relative w-full">
            <select
              value={getOptionKey(selectedOption)}
              onChange={(e) => {
                const foundOpt = options.find(
                  (opt) => getOptionKey(opt) === e.target.value,
                );
                handleOptionChange(foundOpt);
              }}
              className="w-full flex justify-between items-center bg-inherit text-base-light border px-3 py-2 rounded-lg cursor-pointer appearance-none"
            >
              {options.map((opt, idx) => {
                const optKey = getOptionKey(opt);
                const valObj = opt.value;
                const displayText =
                  locale === "en"
                    ? (typeof valObj === "object" ? valObj?.name : valObj) ||
                      opt.en
                    : (typeof valObj === "object"
                        ? valObj?.nameAr || valObj?.name
                        : valObj) ||
                      opt.ar ||
                      opt.valueAr;

                return (
                  <option className="text-base-dark" key={idx} value={optKey}>
                    {displayText}
                  </option>
                );
              })}
            </select>
            <FiChevronsDown
              className={`absolute ${locale === "en" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 pointer-events-none text-base-light scale-x-150`}
            />
          </div>

          <div className="flex gap-8 justify-between items-center w-full">
            <div className="flex font-bold flex-col items-center min-w-0">
              <p className="whitespace-nowrap text-sm">
                {selectedOption?.priceAfter} USD
              </p>
              <p
                className="relative text-gray-400 whitespace-nowrap text-sm
              before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t-2 before:border-gray-400"
              >
                {selectedOption?.priceBefore} USD
              </p>
            </div>

            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isIn) {
                  onAddToCart?.(false);
                  return;
                }

                await addToCart(product, selectedOption);
                onAddToCart?.(true);
              }}
              disabled={false}
              className="relative pb-1 whitespace-nowrap
            after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full 
            after:bg-base-light after:transition-all after:duration-300 text-sm
            hover:after:bg-base-coffe cursor-pointer uppercase flex items-center font-bold transition-all duration-300 hover:text-base-coffe"
            >
              <FiPlus />
              {isIn ? (
                <span>{locale === "en" ? "add to cart" : "اضف للسلة"}</span>
              ) : (
                <span>{locale === "en" ? "Sold Out" : "نفذت الكمية"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
