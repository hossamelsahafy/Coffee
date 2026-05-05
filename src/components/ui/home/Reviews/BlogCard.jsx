import React from "react";
import Image from "next/image";

const BlogCard = ({ blog, locale }) => {
  return (
    <div className="flex lg:flex-row flex-col w-full gap-4 items-center">
      {/* Image */}
      <div className="">
        <Image
          src={blog.ImageSource === "Url" ? blog.ImageUrl : blog.image.url}
          alt={locale === "en" ? blog.title : blog.titleAr}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col font-bold justify-center items-start flex-1">
        <p>{locale === "en" ? blog.title : blog.titleAr}</p>

        <p className="font-semibold line-clamp-1">
          {locale === "en" ? blog.subtitle : blog.subtitleAr}
        </p>

        <p className="line-clamp-2 max-w-xs text-base-coffe">
          {locale === "en" ? blog.des : blog.desAr}
        </p>

        <p>{locale === "en" ? blog.clientName : blog.clientNameAr}</p>
        <div className="flex md:flex-row flex-col gap-2 justify-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Image
                key={idx}
                src={
                  idx < blog.rate
                    ? "/assets/icons8-star-filled-30.png"
                    : "/assets/icons8-star-filled-30 (1).png"
                }
                alt="star"
                width={20}
                height={20}
              />
            ))}
            <p>{blog.rate}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
