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
  ],
};
