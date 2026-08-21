import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "websiteName",
      type: "text",
      label: "Enter Website Name",
      required: true,
    },
    {
      name: "websiteNameAr",
      type: "text",
      label: "Enter Website Name Arabic",
      required: true,
    },
    {
      name: "HeaderVideo",
      type: "text",
      label: "Paste Video URL",
      required: true,
    },
    {
      name: "TextOverVideo",
      type: "array",
      required: true,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "hero", type: "text", required: true },
        { name: "heroAr", type: "text", required: true },
        { name: "subTitle", type: "text", required: true },
        { name: "subTitleAr", type: "text", required: true },
      ],
    },
    {
      name: "Partner",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        {
          name: "subtitle",
          type: "text",
          required: true,
        },
        {
          name: "subtitleAr",
          type: "text",
          required: true,
        },
        {
          name: "Images",
          type: "array",
          fields: [
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
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "Url",
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
    },
    {
      name: "SecondHeader",
      type: "group",
      fields: [
        { name: "SecondHeaderVideo", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "subtitle", type: "text", required: true },
        { name: "subtitleAr", type: "text", required: true },
      ],
    },
    {
      name: "ReviewsSection",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "subtitle", type: "text", required: true },
        { name: "subtitleAr", type: "text", required: true },
        { name: "des", type: "text", required: true },
        { name: "desAr", type: "text", required: true },
        { name: "reviewTitle", type: "text", required: true },
        { name: "reviewTitleAr", type: "text", required: true },

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
              label: "Upload Image",
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
          label: "Upload Image",
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
    {
      name: "discountSection",
      type: "group",
      fields: [
        { name: "discountTitle", type: "text", required: true },
        { name: "discountTitleAr", type: "text", required: true },
      ],
    },
    {
      name: "BestSellingSection",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "des", type: "text", required: true },
        { name: "desAr", type: "text", required: true },
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
              label: "Upload Image",
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
          label: "Upload Image",
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
    {
      name: "BannerSection",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "spanTitle", type: "text", required: true },
        { name: "spanTitleAr", type: "text", required: true },
        { name: "des", type: "text", required: true },
        { name: "desAr", type: "text", required: true },
        {
          name: "ImageSource",
          type: "radio",
          required: true,
          defaultValue: "upload",
          options: [
            {
              value: "Url",
              label: "Paste Image URL",
            },
            {
              value: "upload",
              label: "Upload Image",
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
          label: "Upload Image",
          type: "relationship",
          relationTo: "media",
          hasMany: false,
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
    {
      name: "NotesSection",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },

        { name: "des", type: "text", required: true },
        { name: "desAr", type: "text", required: true },
        {
          name: "ImageSource",
          type: "radio",
          required: true,
          defaultValue: "upload",
          options: [
            {
              value: "Url",
              label: "Paste Image URL",
            },
            {
              value: "upload",
              label: "Upload Image",
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
          label: "Upload Image",
          type: "relationship",
          relationTo: "media",
          hasMany: false,
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
