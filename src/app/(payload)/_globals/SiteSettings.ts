import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",

  access: {
    read: () => true,
  },

  fields: [
    {
      name: "websiteUrl",
      type: "text",
      required: true,
      admin: {
        description:
          "Enter the full website URL, for example https://example.com",
      },
    },

    {
      name: "siteName",
      type: "text",
      required: true,
    },

    {
      name: "siteNameAr",
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
        condition: (_, siblingData) => siblingData?.ImageSource === "upload",
        components: {
          Field: "@/components/admin/CustomMediaSelection",
        },
      },
    },
  ],
};
