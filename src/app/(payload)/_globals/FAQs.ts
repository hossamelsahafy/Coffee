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
      maxRows: 10,
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
    {
      name: "SEO",
      type: "group",
      label: "SEO",

      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta Title",
          required: true,
          admin: {
            description:
              "Recommended: 50–60 characters. Used as the page title in search engines.",
          },
        },

        {
          name: "metaTitleAr",
          type: "text",
          label: "Meta Title (Arabic)",
          required: true,
          admin: {
            description: "Arabic meta title. Recommended: 50–60 characters.",
          },
        },

        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta Description",
          required: true,
          admin: {
            description:
              "Recommended: 150–160 characters. Used as the search engine description.",
          },
        },

        {
          name: "metaDescriptionAr",
          type: "textarea",
          label: "Meta Description (Arabic)",
          required: true,
          admin: {
            description:
              "Arabic meta description. Recommended: 150–160 characters.",
          },
        },

        {
          name: "keywords",
          type: "array",
          label: "Keywords",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
          admin: {
            description: "Add relevant English SEO keywords.",
          },
        },

        {
          name: "keywordsAr",
          type: "array",
          label: "Keywords (Arabic)",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
          admin: {
            description: "Add relevant Arabic SEO keywords.",
          },
        },

        {
          name: "ImageSource",
          type: "radio",
          required: true,
          options: [
            {
              value: "Url",
              label: "Paste Image URL",
            },
            {
              value: "upload",
              label: "Select Image",
            },
          ],
        },
        {
          name: "ImageUrl",
          label: "Paste Image URL",
          type: "text",
          admin: {
            condition: (_, siblingData) => siblingData?.ImageSource === "Url",
          },
        },
        {
          name: "ImageUpload",
          label: "Select Image",
          type: "relationship",
          relationTo: "media",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.ImageSource === "upload",
            components: {
              Field: "@/components/admin/CustomMediaSelection",
            },
          },
        },
      ],
    },
  ],
};
