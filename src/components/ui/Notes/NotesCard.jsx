import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const NotesCard = ({ item, locale }) => {
  const isArabic = locale === "ar";

  const title = isArabic ? item.titleAr : item.title;
  const description = isArabic ? item.desAr : item.des;
  const brandName = isArabic ? item.brandName?.nameAr : item.brandName?.name;
  const slug = isArabic ? item.slugAr : item.slug;

  let imageUrl = "";

  if (item.ImageSource === "Url" && item.ImageUrl) {
    imageUrl = item.ImageUrl;
  } else if (item.ImageSource === "upload" && item.ImageUpload) {
    imageUrl =
      typeof item.ImageUpload === "object" ? item.ImageUpload?.url : imageUrl;
  }

  return (
    <Link
      href={`/${locale}/notes/${slug}`}
      className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-base-border bg-base-Cards transition-all duration-300 hover:border-base-coffe hover:shadow-xl hover:shadow-[#a7897b10]"
    >
      <div className="relative h-52 w-full overflow-hidden bg-base-nav">
        <Image
          src={imageUrl}
          alt={title || "Note Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {brandName && (
          <span className="absolute start-3 top-3 rounded-full border border-base-borderTwo bg-base-dark/80 px-3 py-1 text-xs font-medium tracking-wide text-base-coffe backdrop-blur-md">
            {brandName}
          </span>
        )}
      </div>

      <div className="flex flex-grow flex-col justify-between p-5">
        <div>
          {item.isImportant && (
            <span className="mb-2 inline-block rounded bg-[#603808]/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-base-lighter border border-[#603808]">
              {isArabic ? "مميز" : "Featured"}
            </span>
          )}

          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-base-light transition-colors group-hover:text-base-coffe">
            {title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-base-coffe/80">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-base-border pt-4 text-xs">
          <div className="flex items-center gap-1.5 text-base-coffe/60">
            <Calendar className="h-3.5 w-3.5" />

            <span>
              {new Date(item.createdAt || Date.now()).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 font-medium text-base-lighter transition-colors group-hover:text-base-light">
            <span>{isArabic ? "اقرأ المزيد" : "Read More"}</span>

            <ArrowRight
              className={`h-3.5 w-3.5 transition-transform ${
                isArabic
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotesCard;
