import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { HiOutlinePencil } from "react-icons/hi2";
import { FiChevronsDown } from "react-icons/fi";
import Image from "next/image";
import AddToCartButton from "@/components/shared/Buttons/AddToCartButton";
import Link from "next/link";
const DescriptionSection = ({
  options,
  data,
  activeOption,
  selectOption,
  setSelectedOption,
  locale,
  addtoCart,
  BuyItNow,
  write,
  Quan,
}) => {
  const [liked, setLiked] = useState(false);

  const [Quantity, setQuantity] = useState(1);
  const increase = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <div onClick={() => setLiked((prev) => !prev)} className="cursor-pointer">
        {liked ? (
          <FaHeart className="text-xl" />
        ) : (
          <FaRegHeart className="text-xl text-base-light" />
        )}
      </div>
      <Link href={"#review"}>
        <div className="flex justify-start items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Image
                width={40}
                height={50}
                key={i}
                src="/assets/icons8-star-48.png"
                alt="star"
                className="w-5 h-5"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <HiOutlinePencil className="text-2xl text-base-light" />
            {write}
          </div>
        </div>
      </Link>
      <h2 className="text-3xl font-bold text-base-coffe">
        {locale === "en" ? data?.title : data?.titleAr}
      </h2>
      <p className="text-bold capitalize font-bold">
        {locale === "en"
          ? data?.choices?.choiceType
          : data?.choices?.choiceTypeAr}
        :
        <span className="font-semibold capitalize inline mx-2">
          {activeOption?.value}
        </span>
      </p>
      <div className="relative w-fit">
        <select
          value={selectOption?.value || selectOption?.en}
          onChange={(e) =>
            setSelectedOption(
              options.find((opt) => (opt.value || opt.en) === e.target.value),
            )
          }
          className="bg-inherit text-base-light border px-3 py-2 pr-8 rounded-lg cursor-pointer appearance-none"
        >
          {options.map((opt, idx) => (
            <option
              className="text-base-dark"
              key={idx}
              value={opt.value || opt.en}
            >
              {locale === "en" ? opt.value || opt.en : opt.ar || opt.valueAr}
            </option>
          ))}
        </select>

        <FiChevronsDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-base-light" />
      </div>

      <p className="text-base font-semibold">
        {locale === "en" ? data?.longDes : data?.longDesAr}
      </p>
      <div className="flex items-center gap-2 w-full">
        <p className="font-bold">{Quan}:</p>
        <div className="flex items-center border border-base-light rounded-full overflow-hidden w-fit">
          <button
            onClick={decrease}
            disabled={Quantity <= 1}
            className="px-4 py-2 text-lg hover:bg-base-light/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            −
          </button>

          <span className="px-4 font-bold min-w-10 text-center">
            {Quantity}
          </span>

          <button
            onClick={increase}
            className="px-4 py-2 text-lg hover:bg-base-light/10 transition"
          >
            +
          </button>
        </div>
        <div className="flex md:flex-row flex-col items-center gap-2">
          <p className="text-base-coffe text-2xl font-bold">
            {activeOption?.priceAfter?.toFixed(2)} USD
          </p>
          <p className="relative text-base-coffe text-2xl font-bold opacity-50 before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t-2 before:border-base-coffe">
            {activeOption?.priceBefore?.toFixed(2)} USD
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <AddToCartButton text={addtoCart} width={"w-1/2"} />
        <AddToCartButton
          text={BuyItNow}
          isLink={true}
          width={"w-1/2"}
          linkTarget={`/${locale}/checkout`}
        />
      </div>
    </div>
  );
};

export default DescriptionSection;
