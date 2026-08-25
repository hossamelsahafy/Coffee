import type { GlobalConfig } from "payload";

export const ContactUsPage: GlobalConfig = {
  slug: "contact-us-page",
  label: "Contact Us Page",
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleAr", type: "text", required: true },
    { name: "subtitle", type: "text", required: true },
    { name: "subtitleAr", type: "text", required: true },
    { name: "PhoneNumber", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "address", type: "text", required: true },
    { name: "addressAr", type: "text", required: true },
    {
      name: "locationIframe",
      type: "textarea",
      required: true,

      admin: {
        description:
          "Paste full Google Maps iframe code. It will be converted to the clean Google Maps URL automatically.",
      },

      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) return value;

            const trimmedValue = value.trim();

            if (
              trimmedValue.includes("google.com/maps") ||
              trimmedValue.includes("google.com/maps/embed")
            ) {
              return trimmedValue;
            }

            if (trimmedValue.includes("<iframe")) {
              const match = trimmedValue.match(/src=["']([^"']+)["']/);

              if (!match) {
                throw new Error("Invalid iframe: missing src attribute");
              }

              const src = match[1];

              const isGoogleMaps =
                src.includes("google.com/maps") ||
                src.includes("google.com/maps/embed");

              if (!isGoogleMaps) {
                throw new Error("Only Google Maps iframe is allowed");
              }

              return src;
            }

            throw new Error(
              "Please enter a valid Google Maps iframe code or Google Maps URL",
            );
          },
        ],
      },

      validate: (value) => {
        if (!value) return "Required";

        const isGoogleMaps =
          value.includes("google.com/maps") ||
          value.includes("google.com/maps/embed");

        return isGoogleMaps || "Invalid Google Maps location";
      },
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
