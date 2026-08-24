"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Links from "@/components/shared/Links/Links";
import Image from "next/image";
import NormalSwiper from "@/components/shared/Swiper/NormalSwiper";
import NoteCards from "./NoteCards";
const NotesSection = ({ locale, data, NoteSection, websiteName }) => {
  const t = useTranslations("BlogSection");
  const defaultBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  };
  const src =
    NoteSection.ImageSource === "Url"
      ? NoteSection.ImageUrl
      : NoteSection.ImageUpload.url;
  const title = locale === "en" ? NoteSection.title : NoteSection.titleAr;
  const des = locale === "en" ? NoteSection.des : NoteSection.desAr;
  return (
    <div className="container-custom p-4 ">
      <div className="flex relative justify-between w-full md:flex-row flex-col items-start">
        <div className="flex min-w-1/3 flex-col justify-center gap-4">
          <p className="Coffetitle">{websiteName}</p>
          <p className="CoffeDiscription">{title}</p>
          <p className="w-full md:max-w-md text-base">{des}</p>
          <Links text={t("cta")} targetLink={"notes"} />
          <div className="hidden md:flex justify-end items-end">
            <Image
              src={src}
              width={250}
              height={250}
              className="object-contain"
              alt="Coffee Image"
            />
          </div>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <NormalSwiper
            data={data}
            ItemComponent={NoteCards}
            locale={locale}
            px="px-0"
            breakpoints={defaultBreakpoints}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
