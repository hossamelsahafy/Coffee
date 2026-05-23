import React, { useState } from "react";
import Image from "next/image";
import NormalSwiper from "@/components/shared/Swiper/NormalSwiper";
import ImageSlide from "@/components/shared/Model/ImageSlide";
const ImageSection = ({ activeOption, setSelectedOption, options, locale }) => {
  const [swiper, setSwiper] = useState(null);

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
      slidesPerView: 1,
      spaceBetween: 20,
    },
  };
  const imagesData =
    options?.map((opt) => ({
      id: opt.imageUrl || opt.image.url,
      image: opt.ImageSource === "Url" ? opt.imageUrl : opt.image?.url,
      option: opt,
    })) || [];
  return (
    <div className="flex gap-1 items-center w-full mx-auto">
      <div className="flex flex-col gap-3">
        {imagesData.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedOption(item.option);

              const index = imagesData.findIndex(
                (img) => img.option?.id === item.option?.id,
              );

              swiper?.slideTo(index);
            }}
            className={`p-1 border ${activeOption.id === item.option.id ? "border-base-light" : "border-base-border"} rounded-lg cursor-pointer`}
          >
            <Image
              src={item.image}
              width={80}
              height={80}
              alt="Image"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* swiper */}
      <div className="flex-1 w-full overflow-hidden">
        <NormalSwiper
          changebg={true}
          data={imagesData}
          ItemComponent={ImageSlide}
          locale={locale}
          defaultBreakpoints={defaultBreakpoints}
          slides={1}
          px="px-0"
          onSwiper={setSwiper}
          hidden={true}
          rounded={true}
        />
      </div>
    </div>
  );
};

export default ImageSection;
