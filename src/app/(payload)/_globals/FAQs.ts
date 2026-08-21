import { GlobalConfig } from "payload";

export const FAQs: GlobalConfig = {
  slug: "faqs",
  label: "FAQs",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "titleEn",
          type: "text",
          label: "Title (English)",
          required: true,
        },
        {
          name: "titleAr",
          type: "text",
          label: "Title (Arabic)",
          required: true,
        },
      ],
    },
    {
      name: "descriptionEn",
      type: "textarea",
      label: "Description (English)",
    },
    {
      name: "descriptionAr",
      type: "textarea",
      label: "Description (Arabic)",
    },

    {
      name: "faqItems",
      type: "array",
      label: "FAQ Questions & Answers",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "questionEn",
              type: "text",
              label: "Question (English)",
              required: true,
            },
            {
              name: "questionAr",
              type: "text",
              label: "Question (Arabic)",
              required: true,
            },
          ],
        },
        {
          name: "answerEn",
          type: "richText",
          label: "Answer (English)",
          required: true,
        },
        {
          name: "answerAr",
          type: "richText",
          label: "Answer (Arabic)",
          required: true,
        },
      ],
    },
  ],
};
