import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import ServiceSection from "./ServiceSection";
const AboutUs = ({ data, locale }) => {
  return (
    <div className="container-custom p-4">
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-4xl font-bold text-base-dark text-start">
          {locale === "en" ? data.HeaderOne : data.headerOneAR}
        </h2>
        <div className="flex mt-4 md:flex-row flex-col justify-between w-full text-start gap-4">
          <div className="min-w-1/2">
            {locale === "en" ? (
              <RichText
                data={data.DesOne}
                className="text-base-dark  text-left"
              />
            ) : (
              <RichText data={data.DesOneAR} className="text-base-dark" />
            )}
          </div>
          <div className="min-w-1/2">
            {locale === "en" ? (
              <RichText data={data.DesTwo} className="text-base-dark" />
            ) : (
              <RichText data={data.DesTwoAR} className="text-base-dark" />
            )}
          </div>
        </div>
        <h3 className="text-4xl text-center text-base-dark font-bold w-full mt-4">
          {locale === "en" ? data.HeaderTwo : data.HeaderTwoAr}
        </h3>
        {data.Articles.map((article, index) => (
          <div
            key={article.id}
            className={`flex flex-col md:flex-row gap-8 mt-4 w-full justify-center items-center ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex flex-col text-start md:w-1/2">
              <h4 className="text-3xl my-4 text-base-coffe font-bold">
                {locale === "en" ? article.title : article.titleAr}
              </h4>
              {locale === "en" ? (
                <RichText
                  data={article.des}
                  className="text-base-dark max-w-xl"
                />
              ) : (
                <RichText
                  data={article.desAr}
                  className="text-base-dark max-w-lg"
                />
              )}
            </div>
            <div className="w-full md:flex-1 h-full">
              <div className="relative w-full h-full min-h-100">
                <Image
                  src={
                    article.imageSource === "url"
                      ? article.imageUrl
                      : article.image?.url
                  }
                  alt="Image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
        <ServiceSection
          data={data.Services}
          locale={locale}
          title={locale === "en" ? data.serviceTitle : data.serviceTitleAr}
          subtitle={
            (locale = "en" ? data.serviceSubtitle : data.serviceSubtitleAr)
          }
        />
      </div>
    </div>
  );
};

export default AboutUs;
