import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "footer",
      type: "group",
      fields: [
        { name: "websiteName", type: "text", required: true },
        { name: "websiteNameAr", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "titleAr", type: "text", required: true },
        { name: "span", type: "text", required: true },
        { name: "spanAr", type: "text", required: true },
        { name: "des", type: "text", required: true },
        { name: "desAr", type: "text", required: true },
        { name: "faceBookLink", type: "text" },
        { name: "instgramLink", type: "text" },
        { name: "whatsappLink", type: "text" },
        { name: "xLink", type: "text" },
        {
          name: "leftImageSource",
          label: "Left Image Source Type",
          type: "radio",
          required: true,
          defaultValue: "upload",
          options: [
            { value: "Url", label: "Paste Image URL" },
            { value: "upload", label: "Select Image" },
          ],
        },
        {
          name: "leftImageUrl",
          label: "Left Image URL",
          type: "text",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.leftImageSource === "Url",
          },
        },
        {
          name: "leftImageUpload",
          label: "Select Left Image",
          type: "relationship",
          relationTo: "media",
          hasMany: false,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.leftImageSource === "upload",
            components: {
              Field: "@/components/admin/CustomMediaSelection",
            },
          },
        },

        {
          name: "rightImageSource",
          label: "Right Image Source Type",
          type: "radio",
          required: true,
          defaultValue: "upload",
          options: [
            { value: "Url", label: "Paste Image URL" },
            { value: "upload", label: "Select Image" },
          ],
        },
        {
          name: "rightImageUrl",
          label: "Right Image URL",
          type: "text",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.rightImageSource === "Url",
          },
        },
        {
          name: "rightImageUpload",
          label: "Select Right Image",
          type: "relationship",
          relationTo: "media",
          hasMany: false,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.rightImageSource === "upload",
            components: {
              Field: "@/components/admin/CustomMediaSelection",
            },
          },
        },
      ],
    },
  ],
};
