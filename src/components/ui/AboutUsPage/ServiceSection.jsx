import Image from "next/image";
import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

const ServiceSection = ({ data, locale, title, subtitle }) => {
  return (
    <div className="mt-4 flex flex-col justify-center items-center w-full gap-4">
      <h2 className="text-center text-base-coffe capitalize text-3xl font-bold">
        {title}
      </h2>
      <p className="text-center  max-w-4xl text-base-dark">{subtitle}</p>
      <div className="grid my-4 grid-cols-1 md:grid-cols-3 justify-self-center gap-4 w-full">
        {data.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-4 w-full rounded-lg bg-base-Cards p-4"
          >
            <div className="flex justify-between text-base-dark w-full items-center">
              <h4 className="font-bold text-lg">
                {locale === "en" ? service.title : service.titleAr}
              </h4>
              <Image
                src={
                  service.imageSource === "url"
                    ? service.imageUrl
                    : service.image?.url
                }
                width={30}
                height={40}
                alt="Icon"
                className="object-contain"
              />
            </div>
            <RichText
              data={locale === "en" ? service.des : service.desAr}
              className="text-base-dark"
            />{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
