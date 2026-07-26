"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Links from "@/components/shared/Links/Links";
import { useParams } from "next/navigation";
import BlogSwiper from "./BlogsSwiper";
const BlogsSection = ({ Blogs }) => {
  const t = useTranslations("reviews");
  const { locale } = useParams();
  const uniqueOrigins = Array.from(
    new Map(
      Blogs.filter((blog) => blog.OriginsOfCoffee).map((blog) => [
        blog.OriginsOfCoffee.id,
        blog.OriginsOfCoffee,
      ]),
    ).values(),
  );
  const [selected, setSelected] = useState(null);
  const filteredBlogs = Blogs.filter(
    (blog) => blog.OriginsOfCoffee?.id === selected,
  );
  useEffect(() => {
    if (uniqueOrigins.length > 0 && !selected) {
      setSelected(uniqueOrigins[0].id);
    }
  }, [uniqueOrigins]);
  return (
    <div className="max-w-7xl -mt-10 text-base-light mx-auto p-4 flex md:flex-row flex-col justify-between items-stretch">
      <div
        className={`flex flex-col min-w-1/3 justify-start gap-4 ${locale === "en" ? "md:border-r" : "md:border-l"} border-base-borderTwo pt-10`}
      >
        <p className="font-bold text-lg">{t("coffee")}</p>
        <p className="font-bold text-3xl text-base-coffe">{t("span")}</p>
        <p className="font-semibold text-3xl text-base-coffe">
          {t("fresh_roasted_coffee")}
        </p>
        <p className="w-full md:max-w-sm text-base">
          {t("denver_biscuit_cafe")}
        </p>
        <Links text={t("show_products")} targetLink={"collection"} />
      </div>
      <div
        className={`relative min-w-1/3 flex flex-col justify-start gap-4 ${locale === "en" ? "md:border-r" : "md:border-l"} flex-1 md:p-4 border-base-borderTwo pt-10`}
      >
        <p className="font-semibold">{t("secondTitle")}</p>

        <div className="flex flex-col gap-6">
          <div className="flex relative  md:flex-row flex-col justify-center md:justify-between w-full">
            <div className="flex flex-col gap-6 z-30">
              {uniqueOrigins.map((blog) => (
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
              className={`hidden lg:flex absolute bottom-0 ${locale === "en" ? "right-0" : "left-0"} z-10`}
            >
              <Image
                src="/assets/flying-coffee_o61m6u.png"
                width={200}
                height={200}
                alt="Image"
                className="w-40 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full md:max-w-1/3 justify-start gap-4 md:p-4 flex-1 pt-10">
        <BlogSwiper filteredBlogs={filteredBlogs} locale={locale} />
      </div>
    </div>
  );
};

export default BlogsSection;
