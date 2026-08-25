import type { GlobalConfig } from "payload";

export const Collections: GlobalConfig = {
  slug: "collections",

  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const productsCount = await req.payload.count({
          collection: "products",
        });

        return {
          ...data,
          allProducts: {
            ...data.allProducts,
            productsCount: String(productsCount.totalDocs),
          },
        };
      },
    ],
  },

  fields: [
    {
      name: "CategoriesPageData",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "titleAr",
          type: "text",
        },
        {
          name: "des",
          type: "text",
        },
        {
          name: "desAr",
          type: "text",
        },
      ],
    },
    {
      name: "allProducts",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "titleAr",
          type: "text",
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
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
          unique: true,
          validate: (value) => {
            if (!value) return "Slug is required";

            const isValid =
              /^[\u0600-\u06FF0-9]+(?:-[\u0600-\u06FF0-9]+)*$/.test(value);

            if (!isValid) {
              return "Slug must be Arabic letters/numbers separated by hyphens";
            }

            return true;
          },
        },
        {
          name: "productsCount",
          type: "text",
          admin: {
            readOnly: true,
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
