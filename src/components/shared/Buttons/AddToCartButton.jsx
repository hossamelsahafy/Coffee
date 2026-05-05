import Link from "next/link";
import React from "react";

const AddToCartButton = ({ text, isLink, linkTarget, width }) => {
  const style = `px-6 py-2 hover:bg-base-lighter transition-all text-center duration-300 cursor-pointer ${width} font-bold bg-base-coffe text-base-dark rounded-full`;

  return isLink ? (
    <Link href={linkTarget} className={style}>
      {text}
    </Link>
  ) : (
    <button className={style}>{text}</button>
  );
};

export default AddToCartButton;
