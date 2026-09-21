"use client";

import Image from "next/image";
import React from "react";

export default function ReviewsCard({ reviews = [], locale = "en" }) {
  const isArabic = locale === "ar";

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
        <p className="text-muted-foreground">
          {isArabic ? "لم يتم العثور على تقييمات." : "No reviews found."}
        </p>
      </div>
    );
  }

  const review = reviews[0];

  const reviewId = review.id || review._id;

  const imageUrl =
    review.image?.ImageSource === "Url"
      ? review.image?.imageUrl
      : typeof review.image?.image === "object"
        ? review.image?.image?.url
        : null;

  const title = isArabic
    ? review.titleAr || review.title
    : review.title || review.titleAr;

  const subtitle = isArabic
    ? review.subtitleAr || review.subtitle
    : review.subtitle || review.subtitleAr;

  const description = isArabic
    ? review.desAr || review.des
    : review.des || review.desAr;

  return (
    <div
      key={reviewId}
      dir={isArabic ? "rtl" : "ltr"}
      className="group relative flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-all group-hover:bg-primary/30" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => {
                const rating = Number(review.rate) || 0;
                const isFilled = index < Math.floor(rating);

                return (
                  <Image
                    key={index}
                    src={
                      isFilled
                        ? "/assets/icons8starfilled301.png"
                        : "/assets/icons8star49.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                );
              })}
            </div>
          </div>

          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-md ${
              review.isApproved
                ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/20 text-amber-300"
            }`}
          >
            {review.isApproved
              ? isArabic
                ? "معتمد"
                : "Approved"
              : isArabic
                ? "قيد الانتظار"
                : "Pending"}
          </span>
        </div>

        {imageUrl && (
          <div className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 p-4">
            <Image
              src={imageUrl}
              alt={title || "Review attachment"}
              width={500}
              height={300}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <h3 className="mb-1 line-clamp-1 text-base-coffe text-lg font-semibold tracking-tight">
          {title || (isArabic ? "تقييم بدون عنوان" : "Untitled Review")}
        </h3>

        {subtitle && (
          <p className="mb-3 line-clamp-1 text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        )}

        <p className="line-clamp-3 text-base-coffe text-sm">
          {description ||
            (isArabic ? "لا توجد تفاصيل." : "No description provided.")}
        </p>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-muted-foreground">
          {new Date(review.updatedAt).toLocaleDateString(
            isArabic ? "ar-EG" : "en-US",
          )}
        </span>
      </div>
    </div>
  );
}
