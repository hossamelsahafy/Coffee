import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ItemsButton from "@/components/shared/Buttons/AddToCartButton";
import Link from "next/link";
const Collection = ({ data, locale }) => {
  const t = useTranslations("Collection");
  const totalProductsCount = data.reduce((sum, cat) => {
    return sum + cat.productsCount;
  }, 0);

  const ProductsData = {
    id: "All_products",
    imageUrl:
      "https://res.cloudinary.com/dnszjyuxi/image/upload/v1778169687/1_cfpjul.png",
    title: "All Products",
    titleAr: "جميع المنتجات",
    slug: "products",
    slugAr: "products",
    productsCount: totalProductsCount,
  };

  const dataWithAllProducts = [ProductsData, ...data];
  const getImageSrc = (item) => {
    if (item.slug === "products") return item.imageUrl;

    if (item.ImageSource === "Url") return item.ImageUrl;

    return item?.image?.url;
  };

  return (
    <div className="mt-20 container-custom">
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-4xl font-bold text-base-coffe">
          {t("Collections")}
        </h2>
        <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-10 w-full">
          {dataWithAllProducts.map((data) => {
            const href =
              data.slug === "products"
                ? `/${locale}/products`
                : locale === "en"
                  ? `/${locale}/${data.slug}`
                  : `/${locale}/${data.slugAr}`;

            return (
              <Link key={data.id} href={href} className="block group">
                <div className="flex flex-col justify-center items-center gap-4 text-base-light cursor-pointer">
                  <Image
                    src={getImageSrc(data)}
                    alt={data.title}
                    width={400}
                    height={400}
                    className="object-contain rounded-lg"
                  />

                  <p className="font-bold text-lg text-base-light  group-hover:text-base-coffe transition-colors duration-300">
                    {locale === "en" ? data.title : data.titleAr}
                  </p>

                  <ItemsButton
                    text={`${data.productsCount} - ${
                      locale === "en" ? "Items" : "عناصر"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collection;
