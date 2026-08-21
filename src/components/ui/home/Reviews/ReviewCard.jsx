import React from "react";
import Image from "next/image";

const ReviewCard = ({ review, locale }) => {
  console.log(review);

  return (
    <div className="flex lg:flex-row flex-col w-full gap-4 items-center">
      <div className="">
        <Image
          src={
            review.image.ImageSource === "Url"
              ? review.image.imageUrl
              : review.image.image.url
          }
          alt={locale === "en" ? review.title : review.titleAr}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col font-bold justify-center items-start flex-1">
        <p>{locale === "en" ? review.title : review.titleAr}</p>

        <p className="font-semibold line-clamp-1">
          {locale === "en" ? review.subtitle : review.subtitleAr}
        </p>

        <p className="line-clamp-2 max-w-xs text-base-coffe">
          {locale === "en" ? review.des : review.desAr}
        </p>

        <p>{locale === "en" ? review.clientName : review.clientNameAr}</p>
        <div className="flex md:flex-row flex-col gap-2 justify-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Image
                key={idx}
                src={
                  idx < review.rate
                    ? "/assets/icons8starfilled30.png"
                    : "/assets/icons8starfilled301.png"
                }
                alt="star"
                width={20}
                height={20}
              />
            ))}
            <p>{review.rate}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
