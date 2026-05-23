import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const Header = ({ locale, backToHome, title, length, des }) => {
  return (
    <div className="flex flex-col text-base-light justify-start items-start gap-4 w-full mb-10">
      <Link href={`/${locale}`}>
        <div className="flex justify-start items-center gap-2">
          <div className="border border-base-light rounded-full p-2">
            {locale === "en" ? (
              <FaArrowLeft className="text-base-light text-base" />
            ) : (
              <FaArrowRight className="text-base-light text-base" />
            )}
          </div>
          <p>{backToHome}</p>
        </div>
      </Link>
      <h2 className=" text-start text-3xl font-bold">
        {title} <span className="inline text-base mx-2">({length})</span>
      </h2>
      <p className="font-semibold text-base w-full md:max-w-1/2">{des}</p>
    </div>
  );
};

export default Header;
