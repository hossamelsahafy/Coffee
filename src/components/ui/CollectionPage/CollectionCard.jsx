import React from "react";
import Image from "next/image";
import ItemsButton from "@/components/shared/Buttons/AddToCartButton";
import Link from "next/link";
import CollectionSkelaton from "./CollectionSkelaton";

const CollectionCard = ({ item, locale, isLoading }) => {
  if (isLoading) {
    return <CollectionSkelaton />;
  }

  const getImageSrc = (item) => {
    if (item.id === "All_products") return item.imageUrl;
    if (item.ImageSource === "Url") return item.ImageUrl;
    return item?.uploadImage?.url;
  };

  const href =
    item.slug === "products"
      ? `/${locale}/products`
      : locale === "en"
        ? `/${locale}/collections/${item.slug}`
        : `/${locale}/collections/${item.slugAr}`;

  return (
    <Link href={href} className="block group w-full">
      <div className="flex flex-col justify-center items-center gap-4 text-base-light cursor-pointer w-full">
        <div className="w-full h-72 relative flex items-center justify-center overflow-hidden rounded-lg bg-base-dark/5">
          <Image
            src={getImageSrc(item)}
            alt={locale === "en" ? item.title : item.titleAr}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <p className="font-bold text-lg text-base-light group-hover:text-base-coffe transition-colors duration-300 text-center truncate w-full">
          {locale === "en" ? item.title : item.titleAr}
        </p>

        <ItemsButton
          isLink={false}
          text={`${item.productsCount} - ${
            locale === "en" ? "Items" : "عناصر"
          }`}
        />
      </div>
    </Link>
  );
};

export default CollectionCard;
