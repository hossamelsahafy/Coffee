import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import WriteReview from "@/components/shared/Buttons/AddToCartButton";
const ReviewsSection = () => {
  const t = useTranslations("ReviewsSection");
  const WriteAReview = t("Write");
  return (
    <div id="review" className="container-custom">
      <h2 className="text-2xl font-bold">{t("H2")}</h2>
      <div className="flex w-full justify-between max-w-2xl gap-4 items-center mt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Image
                  src={"/assets/icons8-star-48.png"}
                  width={20}
                  height={20}
                  alt="stars image"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <p className="font-semibold">{t("BeFirst")}</p>
        </div>

        <WriteReview text={WriteAReview} width={""} />
      </div>
    </div>
  );
};

export default ReviewsSection;
