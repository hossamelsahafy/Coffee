"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SlugMethods from "@/actions/SlugMethods";
import CountrySelect from "./CountrySelect";

export default function ReviewForm({
  locale,
  productID,
  selectedOption,
  onSuccess,
  onError,
  countriesData,
}) {
  const router = useRouter();
  const t = useTranslations("ReviewForm");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [hoverRate, setHoverRate] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    des: "",
    rate: 5,
    country: "",
  });

  const englishRegex = /^[A-Za-z0-9\s]+$/;

  const arabicRegex = /^[\u0621-\u064A0-9\s]+$/;

  const handleCountryChange = (countryID) => {
    setFormData((prev) => ({
      ...prev,
      country: countryID,
    }));

    setErrors((prev) => {
      if (!prev.country) {
        return prev;
      }

      const updatedErrors = {
        ...prev,
      };

      delete updatedErrors.country;

      return updatedErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const updatedErrors = {
        ...prev,
      };

      delete updatedErrors[name];

      return updatedErrors;
    });
  };

  const validateTextField = (value, requiredMessage, regex) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return requiredMessage;
    }

    if (!regex.test(trimmedValue)) {
      return t("InvalidText");
    }

    return null;
  };

  const validateFields = () => {
    const regex = locale === "ar" ? arabicRegex : englishRegex;

    const fields = {
      title: [formData.title, t("TitleRequired")],
      subtitle: [formData.subtitle, t("SubtitleRequired")],
      des: [formData.des, t("DescRequired")],
    };

    const newErrors = {};

    Object.entries(fields).forEach(([field, [value, requiredMessage]]) => {
      const error = validateTextField(value, requiredMessage, regex);

      if (error) {
        newErrors[field] = error;
      }
    });

    if (!formData.country) {
      newErrors.country = t("CountryRequired");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const message = t("ValidationError");

      if (onError) {
        onError(message);
      }

      return;
    }

    setLoading(true);

    try {
      const reviewPayload = {
        rate: Number(formData.rate),

        product: productID,

        productOption: selectedOption?.id || null,

        country: formData.country || null,

        ...(locale === "en"
          ? {
              title: formData.title.trim(),
              subtitle: formData.subtitle.trim(),
              des: formData.des.trim(),
            }
          : {
              titleAr: formData.title.trim(),
              subtitleAr: formData.subtitle.trim(),
              desAr: formData.des.trim(),
            }),
      };

      await SlugMethods("reviews", "POST", reviewPayload);

      setFormData({
        title: "",
        subtitle: "",
        des: "",
        rate: 5,
        country: "",
      });

      setErrors({});

      setHoverRate(0);

      router.refresh();

      if (onSuccess) {
        onSuccess(t("SuccessMsg"));
      }
    } catch (err) {
      const errorMessage = (
        err?.errors?.[0]?.message ||
        err?.message ||
        ""
      ).toLowerCase();

      let errorMsg = t("ErrorDefault");

      if (
        errorMessage.includes("not allowed to perform this action") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("unauthenticated")
      ) {
        errorMsg = t("LoginRequiredError");
      } else {
        errorMsg =
          err?.errors?.[0]?.message || err?.message || t("ErrorDefault");
      }

      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-4 p-6 border rounded-lg bg-base-nav border-base-borderTwo text-base-light shadow-xl w-full"
    >
      <h3 className="text-xl font-bold text-center text-base-lighter border-b border-base-border pb-2">
        {t("Heading")}
      </h3>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-base-lighter">
          {t("TitleLabel")}
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`bg-black/40 border p-2.5 rounded text-sm text-base-light focus:outline-none transition ${
            errors.title
              ? "border-amber-200 focus:border-amber-200"
              : "border-base-borderTwo focus:border-base-coffe"
          }`}
          placeholder={t("TitlePlaceholder")}
        />

        {errors.title && (
          <span className="text-amber-200 text-xs">{errors.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-base-lighter">
          {t("SubtitleLabel")}
        </label>

        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className={`bg-black/40 border p-2.5 rounded text-sm text-base-light focus:outline-none transition ${
            errors.subtitle
              ? "border-amber-200 focus:border-amber-200"
              : "border-base-borderTwo focus:border-base-coffe"
          }`}
          placeholder={t("SubtitlePlaceholder")}
        />

        {errors.subtitle && (
          <span className="text-amber-200 text-xs">{errors.subtitle}</span>
        )}
      </div>

      <CountrySelect
        locale={locale}
        countriesData={countriesData}
        value={formData.country}
        onChange={handleCountryChange}
        error={errors.country}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-base-lighter">
          {t("DescLabel")}
        </label>

        <textarea
          name="des"
          value={formData.des}
          onChange={handleChange}
          className={`bg-black/40 border p-2.5 rounded text-sm text-base-light focus:outline-none transition ${
            errors.des
              ? "border-amber-200 focus:border-amber-200"
              : "border-base-borderTwo focus:border-base-coffe"
          }`}
          rows={3}
          placeholder={t("DescPlaceholder")}
        />

        {errors.des && (
          <span className="text-amber-200 text-xs">{errors.des}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-base-lighter">
          {t("RatingLabel")}
        </label>

        <div
          className="flex justify-center items-center gap-1"
          onMouseLeave={() => setHoverRate(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const activeRate = hoverRate || formData.rate;

            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    rate: star,
                  }))
                }
                onMouseEnter={() => setHoverRate(star)}
                className="text-3xl leading-none transition-transform duration-150 hover:scale-110 focus:outline-none cursor-pointer"
                aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
              >
                <span
                  className={
                    star <= activeRate ? "text-base-coffe" : "text-gray-500"
                  }
                >
                  ★
                </span>
              </button>
            );
          })}

          <span className="ml-2 text-sm text-base-light">
            {hoverRate || formData.rate}/5
          </span>
        </div>

        {errors.rate && (
          <span className="text-amber-200 text-xs">{errors.rate}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-base-coffe text-black font-semibold p-3 rounded hover:bg-base-lighter transition cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("SubmittingBtn") : t("SubmitBtn")}
      </button>
    </form>
  );
}
