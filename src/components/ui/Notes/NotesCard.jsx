import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const NotesCard = ({ item, locale }) => {
  const isArabic = locale === "ar";

  const title = isArabic ? item.titleAr : item.title;
  const description = isArabic ? item.desAr : item.des;
  const brandName = isArabic ? item.brandNameAr : item.brandName;
  const slug = isArabic ? item.slugAr : item.slug;

  let imageUrl = "";
  if (item.ImageSource === "Url" && item.ImageUrl) {
    imageUrl = item.ImageUrl;
  } else if (item.ImageSource === "upload" && item.ImageUpload) {
    imageUrl =
      typeof item.ImageUpload === "object" ? item.ImageUpload?.url : imageUrl;
  }

  return (
    <div className="group flex flex-col justify-between bg-base-Cards border border-base-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-base-coffe hover:shadow-xl hover:shadow-[#a7897b10] h-full">
      <div className="relative w-full h-52 overflow-hidden bg-base-nav">
        <Image
          src={imageUrl}
          alt={title || "Note Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {brandName && (
          <span className="absolute top-3 start-3 bg-base-dark/80 backdrop-blur-md text-base-coffe border border-base-borderTwo px-3 py-1 rounded-full text-xs font-medium tracking-wide">
            {brandName}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {item.isImportant && (
            <span className="inline-block text-[10px] uppercase tracking-wider bg-[#603808]/40 text-base-lighter border border-[#603808] px-2 py-0.5 rounded mb-2 font-semibold">
              {isArabic ? "مميز" : "Featured"}
            </span>
          )}

          <h3 className="text-base-light font-semibold text-lg line-clamp-1 group-hover:text-base-coffe transition-colors mb-2">
            {title}
          </h3>

          <p className="text-base-coffe/80 text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-base-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-base-coffe/60">
            <Calendar className="w-3.5 h-3.5" />
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

          <Link
            href={`/${locale}/notes/${slug}`}
            className="inline-flex items-center gap-1 text-base-lighter font-medium hover:text-base-light transition-colors group/link"
          >
            <span>{isArabic ? "اقرأ المزيد" : "Read More"}</span>
            <ArrowRight
              className={`w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 ${isArabic ? "rotate-180 group-hover/link:-translate-x-1" : ""}`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
