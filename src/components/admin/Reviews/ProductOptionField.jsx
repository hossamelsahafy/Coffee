"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useField, useFormFields } from "@payloadcms/ui";

const ProductOptionField = () => {
  const { value, setValue } = useField({
    path: "productOption",
  });

  const { setValue: setImageSourceValue } = useField({
    path: "image.ImageSource",
  });
  const { setValue: setImageValue } = useField({ path: "image.image" });
  const { setValue: setImageUrlValue } = useField({ path: "image.imageUrl" });

  const productValue = useFormFields(([fields]) => fields.product?.value);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productValue) {
      setProduct(null);
      setValue(null);
      setImageSourceValue(null);
      setImageValue(null);
      setImageUrlValue(null);
      return;
    }

    const productId =
      typeof productValue === "string"
        ? productValue
        : productValue?.id
          ? String(productValue.id)
          : null;

    if (!productId) {
      setProduct(null);
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}?depth=2`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product options:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [
    productValue,
    setValue,
    setImageSourceValue,
    setImageValue,
    setImageUrlValue,
  ]);

  const options = useMemo(() => {
    if (!product?.choices) return [];

    const choiceGroup = product.choices;
    const rawOptions = choiceGroup.options || [];

    return rawOptions.map((option, index) => ({
      ...option,
      id: option.id ? String(option.id) : String(index),
      choiceType: choiceGroup.choiceType,
      choiceTypeAr: choiceGroup.choiceTypeAr,
    }));
  }, [product]);

  useEffect(() => {
    if (options.length > 0) {
      if (!value || !options.some((opt) => opt.id === value)) {
        const firstOption = options[0];
        setValue(firstOption.id);
        setImageSourceValue(firstOption.ImageSource || null);
        setImageValue(firstOption.image || null);
        setImageUrlValue(firstOption.imageUrl || null);
      }
    }
  }, [
    options,
    value,
    setValue,
    setImageSourceValue,
    setImageValue,
    setImageUrlValue,
  ]);

  const selectedOption = useMemo(() => {
    if (options.length === 0) return null;
    return options.find((option) => option.id === value) || options[0];
  }, [options, value]);

  const getImageUrl = (opt) => {
    if (!opt) return null;
    if (opt.ImageSource === "Url" && opt.imageUrl) {
      return opt.imageUrl;
    }
    if (opt.ImageSource === "upload" && opt.image) {
      return typeof opt.image === "object" ? opt.image.url : null;
    }
    return null;
  };

  const selectedImageUrl = getImageUrl(selectedOption);

  const handleOptionChange = (optionId) => {
    setValue(optionId || null);

    if (!optionId) {
      setImageSourceValue(null);
      setImageValue(null);
      setImageUrlValue(null);
      return;
    }

    const chosen = options.find((opt) => opt.id === optionId);
    if (chosen) {
      setImageSourceValue(chosen.ImageSource || null);
      setImageValue(chosen.image || null);
      setImageUrlValue(chosen.imageUrl || null);
    }
  };

  return (
    <div className="mb-6 space-y-3">
      <div>
        <label className="block text-sm font-semibold tracking-wide text-[#EFEBE9]">
          Product Option
        </label>
        <p className="text-xs text-[#BCAAA4] mt-0.5">
          Select the product option reviewed. The image will automatically sync
          from this option.
        </p>
      </div>

      {!productValue && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[#4E342E] bg-transparent px-4 py-3 text-sm text-[#D7CCC8]">
          <span className="h-2 w-2 rounded-full bg-[#8D6E63]" />
          Please select a product above first.
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-[#4E342E] bg-transparent px-4 py-3 text-sm text-[#D7CCC8]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D7CCC8] border-t-transparent" />
          Loading product options...
        </div>
      )}

      {!loading && productValue && options.length === 0 && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[#4E342E] bg-[#2D1B18] px-4 py-3 text-sm text-[#D7CCC8]">
          <span className="h-2 w-2 rounded-full bg-[#EF5350]" />
          This product has no available options.
        </div>
      )}

      {!loading && options.length > 0 && (
        <div className="space-y-3">
          <select
            value={value || options[0]?.id || ""}
            onChange={(event) => handleOptionChange(event.target.value)}
            className="w-full rounded-lg items-center  border border-[#5D4037] bg-[#1E1210] px-3.5 py-2.5 text-sm font-medium text-[#EFEBE9] outline-none transition-all focus:border-[#8D6E63] focus:ring-2 focus:ring-[#5D4037] hover:border-[#6D4C41]"
          >
            {options.map((option) => {
              const typeText = option.choiceType
                ? `${option.choiceType} : `
                : "";
              const valText = option.value || "";
              const valArText = option.valueAr ? ` (${option.valueAr})` : "";
              return (
                <option
                  key={option.id}
                  value={option.id}
                  className="bg-[#1E1210] text-[#EFEBE9]"
                >
                  {typeText}
                  {valText}
                  {valArText}
                </option>
              );
            })}
          </select>

          {selectedOption && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#5D4037] bg-transparent p-4 shadow-md transition-all">
              <div className="flex items-center gap-3.5">
                <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-lg border border-[#4E342E] bg-[#1E1210] shadow-inner flex items-center justify-center">
                  {selectedImageUrl ? (
                    <img
                      src={selectedImageUrl}
                      alt={selectedOption.value}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-[#8D6E63] font-medium text-center px-1">
                      No Image
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="inline-block rounded bg-[#4E342E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D7CCC8]">
                    {selectedOption.choiceType || "Option"}
                    {selectedOption.choiceTypeAr
                      ? ` / ${selectedOption.choiceTypeAr}`
                      : ""}
                  </span>
                  <div className="text-sm font-semibold text-[#EFEBE9]">
                    {selectedOption.value}
                  </div>
                  {selectedOption.valueAr && (
                    <div
                      className="text-xs font-medium text-[#BCAAA4]"
                      dir="rtl"
                    >
                      {selectedOption.valueAr}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right text-xs pr-2">
                <span className="block text-sm font-bold text-[#EFEBE9]">
                  {selectedOption.priceAfter != null
                    ? `$${selectedOption.priceAfter}`
                    : ""}
                </span>
                {selectedOption.priceBefore &&
                  selectedOption.priceBefore > selectedOption.priceAfter && (
                    <span className="line-through text-xs text-[#8D6E63]">
                      ${selectedOption.priceBefore}
                    </span>
                  )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductOptionField;
