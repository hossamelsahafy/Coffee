import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    { name: "titleAr", type: "text", required: true, label: "Title (AR)" },
    { name: "subtitle", type: "text", required: true, label: "Subtitle" },
    {
      name: "subtitleAr",
      type: "text",
      required: true,
      label: "Subtitle (AR)",
    },

    { name: "HeaderOne", type: "text", required: true, label: "Header One" },
    {
      name: "HeaderOneAr",
      type: "text",
      required: true,
      label: "Header One (AR)",
    },

    {
      name: "DesOne",
      type: "richText",
      required: true,
      label: "Description One",
    },
    {
      name: "DesOneAR",
      type: "richText",
      required: true,
      label: "Description One (AR)",
    },

    {
      name: "DesTwo",
      type: "richText",
      required: true,
      label: "Description Two",
    },
    {
      name: "DesTwoAR",
      type: "richText",
      required: true,
      label: "Description Two (AR)",
    },

    { name: "HeaderTwo", type: "text", required: true, label: "Header Two" },
    {
      name: "HeaderTwoAr",
      type: "text",
      required: true,
      label: "Header Two (AR)",
    },

    {
      name: "Articles",
      type: "array",
      label: "Articles",
      fields: [
        { name: "title", type: "text", required: true, label: "Title" },
        { name: "titleAr", type: "text", required: true, label: "Title (AR)" },

        { name: "des", type: "richText", required: true, label: "Description" },
        {
          name: "desAr",
          type: "richText",
          required: true,
          label: "Description (AR)",
        },

        {
          name: "imageSource",
          type: "radio",
          defaultValue: "upload",
          label: "Image Source",
          options: [
            { label: "Paste URL", value: "url" },
            { label: "Select Image", value: "upload" },
          ],
        },
        {
          name: "image",
          relationTo: "media",
          type: "relationship",
          label: "Select Image",
          admin: {
            condition: (_, siblingData) => siblingData.imageSource === "upload",
            components: {
              Field: "@/components/admin/CustomMediaSelection",
            },
          },
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Paste Image Url",
          admin: {
            condition: (_, siblingData) => siblingData.imageSource === "url",
          },
        },
      ],
    },

    {
      name: "serviceTitle",
      required: true,
      type: "text",
      label: "Service Title",
    },
    {
      name: "serviceTitleAr",
      required: true,
      type: "text",
      label: "Service Title (AR)",
    },

    {
      name: "serviceSubtitle",
      required: true,
      type: "text",
      label: "Service Subtitle",
    },
    {
      name: "serviceSubtitleAr",
      required: true,
      type: "text",
      label: "Service Subtitle (AR)",
    },

    {
      name: "Services",
      type: "array",
      label: "Services",
      fields: [
        { name: "title", required: true, type: "text", label: "Title" },
        { name: "titleAr", required: true, type: "text", label: "Title (AR)" },

        { name: "des", required: true, type: "richText", label: "Description" },
        {
          name: "desAr",
          required: true,
          type: "richText",
          label: "Description (AR)",
        },

        {
          name: "imageSource",
          type: "radio",
          defaultValue: "url",
          label: "Image Source",
          options: [
            { label: "URL", value: "url" },
            { label: "Upload", value: "upload" },
          ],
        },
        {
          name: "image",
          relationTo: "media",
          type: "relationship",
          label: "Upload Image",
          admin: {
            condition: (_, siblingData) => siblingData.imageSource === "upload",
          },
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Image URL",
          admin: {
            condition: (_, siblingData) => siblingData.imageSource === "url",
          },
        },
      ],
    },
    {
      name: "SEO",
      type: "group",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          required: true,
        },
        {
          name: "metaTitleAr",
          type: "text",
          required: true,
        },
        {
          name: "metaDescription",
          type: "textarea",
          required: true,
        },
        {
          name: "metaDescriptionAr",
          type: "textarea",
          required: true,
        },
        {
          name: "keywords",
          type: "array",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "keywordsAr",
          type: "array",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
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
