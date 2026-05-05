import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
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
      name: "slug",
      type: "text",
      required: true,
      validate: (value) => {
        if (!value) return "Slug is required";

        const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

        if (!isValid) {
          return "Slug must be lowercase, no spaces, use hyphens (-), No Special Characters";
        }

        return true;
      },
    },
    {
      name: "slugAr",
      type: "text",
      required: true,
      validate: (value) => {
        if (!value) return "Slug is required";

        const isValid = /^[\u0600-\u06FF0-9]+(?:-[\u0600-\u06FF0-9]+)*$/.test(
          value,
        );

        if (!isValid) {
          return "Slug must be Arabic letters/numbers separated by hyphens";
        }

        return true;
      },
    },
    {
      name: "ImageSource",
      type: "radio",
      label: "Choose Image Source",
      options: [
        { value: "Url", label: "Paste Image Url" },
        { value: "upload", label: "Upload Image" },
      ],
      defaultValue: "Url",
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
      name: "uploadImage",
      type: "relationship",
      relationTo: "media",
      label: "Upload Image",
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "upload",
      },
    },
  ],
};
