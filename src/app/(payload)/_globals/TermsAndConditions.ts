import type { GlobalConfig } from "payload";

export const TermsAndConditions: GlobalConfig = {
  slug: "terms-and-conditions",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "titleAr",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "descriptionAr",
      type: "textarea",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },

    {
      name: "contentAr",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};
