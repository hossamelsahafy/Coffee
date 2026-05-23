import type { CollectionConfig } from "payload";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
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
      name: "des",
      type: "text",
      required: true,
    },
    {
      name: "desAr",
      type: "text",
      required: true,
    },
    {
      name: "OriginsOfCoffee",
      type: "relationship",
      relationTo: "origins-of-coffee",
    },
    {
      name: "ImageSource",
      label: "Choose Image Source",
      required: true,
      type: "radio",
      defaultValue: "Url",
      options: [
        { label: "Paste Image Url", value: "Url" },
        { label: "Upload Image", value: "Upload" },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Upload Image",
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "Upload",
      },
    },
    {
      name: "ImageUrl",
      type: "text",
      label: "Paste Image Url",
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "Url",
      },
    },
    {
      name: "rate",
      type: "number",
      min: 0,
      max: 5,
    },
    { name: "clientName", type: "text" },

    { name: "clientNameAr", type: "text" },
  ],
};
