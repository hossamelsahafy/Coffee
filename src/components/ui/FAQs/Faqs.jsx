"use client";

import React, { useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

const Faqs = ({ data, locale }) => {
  const isArabic = locale === "ar";
  const faqList = data?.faqItems || data || [];
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqList.length) return null;

  const leftColumnItems = faqList.filter((_, index) => index % 2 === 0);
  const rightColumnItems = faqList.filter((_, index) => index % 2 !== 0);

  const renderFaqItem = (item, originalIndex) => {
    const question = isArabic ? item.questionAr : item.questionEn;
    const answer = isArabic ? item.answerAr : item.answerEn;
    const isOpen = openIndex === originalIndex;

    return (
      <div
        key={originalIndex}
        className={`bg-base-Cards border border-base-borderTwo rounded-2xl p-5 md:p-6 shadow-xl shadow-black/35 transition-colors duration-300 ${isOpen ? "border-base-coffe" : ""}`}
      >
        <button
          type="button"
          onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
          className="w-full flex justify-between items-center gap-4 cursor-pointer font-medium text-lg text-base-CopffeeLight text-start"
        >
          <span className="hover:text-base-lighter transition-colors duration-200">
            {question}
          </span>

          <span
            className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-base-borderTwo text-base-lighter transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </span>
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div
              className={`pt-5 mt-5 border-t border-base-borderTwo text-coffeText leading-relaxed prose prose-invert max-w-none prose-p:text-coffeText prose-p:leading-7 prose-headings:text-base-CopffeeLight prose-strong:text-base-lighter prose-a:text-base-lighter prose-a:hover:text-base-CopffeeLight prose-li:text-coffeText prose-blockquote:border-base-coffe prose-blockquote:text-base-lighter transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            >
              {answer && <RichText data={answer} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      className="my-10 px-4 max-w-6xl mx-auto text-base-CopffeeLight"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-wide text-base-coffe">
        {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          {leftColumnItems.map((item, i) => renderFaqItem(item, i * 2))}
        </div>
        <div className="space-y-4">
          {rightColumnItems.map((item, i) => renderFaqItem(item, i * 2 + 1))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
