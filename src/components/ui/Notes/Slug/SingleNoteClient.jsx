"use client";

import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { FiChevronLeft, FiTag } from "react-icons/fi";

function resolveNoteImageUrl(note) {
  if (!note) return null;

  if (note.ImageSource === "Url") {
    return note.ImageUrl || null;
  }

  if (note.ImageSource === "upload") {
    const image = note.ImageUpload;

    if (!image) return null;

    if (typeof image === "string") {
      return null;
    }

    return (
      image.url ||
      image.sizes?.large?.url ||
      image.sizes?.medium?.url ||
      image.sizes?.thumbnail?.url ||
      null
    );
  }

  return null;
}

export default function SingleNoteClient({ note, locale }) {
  const isAr = locale === "ar";

  const title = isAr ? note.titleAr : note.title;
  const des = isAr ? note.desAr : note.des;
  const brandName = isAr ? note.brandNameAr : note.brandName;

  const richContent = isAr ? note.lonDesAr : note.longDes;

  const imageUrl = resolveNoteImageUrl(note);

  return (
    <article
      className="min-h-screen mt-24 border-t border-base-nav p-4 bg-black text-white py-12 px-4 sm:px-6 lg:px-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto space-y-10">
        <nav>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-base-coffe transition-colors font-medium"
          >
            <FiChevronLeft className={isAr ? "rotate-180" : ""} size={18} />

            {isAr ? "العودة إلى الرئيسية" : "Back to Home"}
          </Link>
        </nav>

        <header className="space-y-6">
          {brandName && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-CardsFilters border border-base-borderTwo text-base-coffe text-sm font-medium">
              <FiTag size={14} />

              <span>{brandName}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {des && (
            <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed border-r-2 border-l-2 border-base-coffe/40 px-4 py-1">
              {des}
            </p>
          )}
        </header>

        {imageUrl && (
          <div className="relative w-full h-[300px] sm:h-[450px] rounded-2xl overflow-hidden border border-base-borderTwo bg-base-Cards shadow-2xl">
            <Image
              src={imageUrl}
              alt={title || "Note Image"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {richContent && (
          <section className="p-6 sm:p-10 rounded-2xl bg-base-CardsFilters/20 border border-base-borderTwo backdrop-blur-sm shadow-xl">
            <div className="space-y-4 text-gray-300 leading-relaxed text-base sm:text-lg">
              <RichText data={richContent} />
            </div>
          </section>
        )}

        <footer className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-base-darker to-black border border-base-borderTwo flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-lg font-bold text-base-coffe">
              {isAr ? "استكشف منتجاتنا المميزة" : "Explore Our Products"}
            </h3>

            <p className="text-sm text-gray-400">
              {isAr
                ? "احصل على أفضل محاصيل القهوة المختصة الآن"
                : "Discover curated specialty coffee beans"}
            </p>
          </div>

          <Link
            href={`/${locale}/products`}
            className="px-6 py-3 rounded-xl bg-base-coffe text-white font-semibold text-sm hover:bg-base-lighter hover:text-black transition-all shadow-md active:scale-95"
          >
            {isAr ? "تسوق الآن" : "Shop Now"}
          </Link>
        </footer>
      </div>
    </article>
  );
}
