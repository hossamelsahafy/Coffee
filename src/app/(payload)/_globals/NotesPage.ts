import { GlobalConfig } from "payload";

export const NotesPage: GlobalConfig = {
  slug: "notes-page",
  label: "Notes Page",
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
  ],
};
