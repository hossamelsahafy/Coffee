"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Links from "@/components/shared/Links/Links";
import { useParams } from "next/navigation";
import ReviewsSwiper from "./ReviewsSwiper";

const ReviewsSection = ({
  websiteName,
  countries,
  initialReviewsMap,
  ReviewsSectionData,
}) => {
  const t = useTranslations("reviews");
  const { locale } = useParams();

  const [selected, setSelected] = useState(countries?.[0]?.id || null);

  const currentCountryData = initialReviewsMap?.[selected] || {
    docs: [],
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const title =
    locale === "en" ? ReviewsSectionData?.title : ReviewsSectionData?.titleAr;

  const subtitle =
    locale === "en"
      ? ReviewsSectionData?.subtitle
      : ReviewsSectionData?.subtitleAr;

  const describe =
    locale === "en" ? ReviewsSectionData?.des : ReviewsSectionData?.desAr;

  const image =
    ReviewsSectionData?.ImageSource === "Url"
      ? ReviewsSectionData?.ImageUrl
      : ReviewsSectionData?.ImageUpload?.url;

  const reviewTitle =
    locale === "en"
      ? ReviewsSectionData?.reviewTitle
      : ReviewsSectionData?.reviewTitleAr;

  return (
    // Switched to grid-cols-1 md:grid-cols-3 with uniform border styling between columns
    <div className="max-w-7xl -mt-10 text-base-light mx-auto p-4 grid grid-cols-1 md:grid-cols-3 items-stretch">
      {/* Column 1 */}
      <div
        className={`flex flex-col text-start justify-start gap-4 ${
          locale === "en" ? "md:border-r" : "md:border-l"
        } border-base-borderTwo pt-4 ${locale === "en" ? "md:pr-6" : "md:pl-6"}`}
      >
        <p className="font-bold text-lg">{websiteName}</p>
        <p className="font-bold text-3xl text-base-coffe">{title}</p>
        <p className="font-semibold text-3xl text-base-coffe">{subtitle}</p>
        <p className="w-full text-base">{describe}</p>
        <Links text={t("show_products")} targetLink={"collection"} />
      </div>

      {/* Column 2 */}
      <div
        className={`relative flex flex-col justify-start gap-4 ${
          locale === "en" ? "md:border-r md:px-6" : "md:border-l md:px-6"
        } border-base-borderTwo pt-4`}
      >
        <p className="font-semibold h-7 flex items-center">{reviewTitle}</p>

        <div className="flex flex-col gap-6">
          <div className="flex relative md:flex-row flex-col justify-center md:justify-between w-full">
            <div className="flex flex-col gap-6 z-30">
              {countries.map((blog) => (
                <p
                  key={blog.id}
                  onClick={() => setSelected(blog.id)}
                  className={`relative w-fit inline-block text-2xl text-base-coffe font-bold pb-1 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
                    after:h-[1px] after:bg-base-light after:transition-all after:duration-300
                    hover:text-base-light
                    ${selected === blog.id ? "after:w-full text-base-light" : "after:w-0"}`}
                >
                  {locale === "ar" ? blog.titleAr : blog.title}
                </p>
              ))}
            </div>
            <div
              className={`hidden lg:flex absolute bottom-0 ${
                locale === "en" ? "right-0" : "left-0"
              } z-10`}
            >
              <Image
                src={image}
                width={200}
                height={200}
                alt="Image"
                className="max-w-52"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div
        className={`flex flex-col w-full justify-start gap-4 pt-4 ${locale === "en" ? "md:pl-6" : "md:pr-6"}`}
      >
        <div className="h-7 hidden md:block" aria-hidden="true" />

        <ReviewsSwiper
          filteredReviews={currentCountryData.docs}
          initialTotalPages={currentCountryData.totalPages}
          initialHasNextPage={currentCountryData.hasNextPage}
          countryId={selected}
          locale={locale}
        />
      </div>
    </div>
  );
};

export default ReviewsSection;
