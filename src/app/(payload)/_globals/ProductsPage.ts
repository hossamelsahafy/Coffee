import type { GlobalConfig } from "payload";

export const ProductsPage: GlobalConfig = {
  slug: "products-page",
  label: "Products Page",

  access: {
    read: () => true,
  },

  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
    },

    {
      name: "titleAr",
      type: "text",
      label: "Title (Arabic)",
      required: true,
    },

    {
      name: "description",
      type: "textarea",
      label: "Description",
      required: true,
    },

    {
      name: "descriptionAr",
      type: "textarea",
      label: "Description (Arabic)",
      required: true,
    },

    // =========================
    // SEO
    // =========================
    {
      name: "SEO",
      type: "group",
      label: "SEO",

      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta Title",
          admin: {
            description:
              "SEO title for search engines. Recommended: 50–60 characters.",
          },
        },

        {
          name: "metaTitleAr",
          type: "text",
          label: "Meta Title (Arabic)",
          admin: {
            description: "Arabic SEO title. Recommended: 50–60 characters.",
          },
        },

        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta Description",
          admin: {
            description:
              "SEO description for search engines. Recommended: 150–160 characters.",
          },
        },

        {
          name: "metaDescriptionAr",
          type: "textarea",
          label: "Meta Description (Arabic)",
          admin: {
            description:
              "Arabic SEO description. Recommended: 150–160 characters.",
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
          type: "select",
          label: "SEO Image Source",
          defaultValue: "upload",

          options: [
            {
              label: "URL",
              value: "Url",
            },
            {
              label: "Upload",
              value: "upload",
            },
          ],
        },

        {
          name: "ImageUrl",
          type: "text",
          label: "SEO Image URL",

          admin: {
            condition: (_, siblingData) => siblingData?.ImageSource === "Url",
          },
        },

        {
          name: "ImageUpload",
          type: "relationship",
          label: "SEO Image Upload",
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
