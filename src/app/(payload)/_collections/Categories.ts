import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    components: {
      views: {
        list: {
          Component: "@/components/admin/Categories/CategoriesGrid",
        },
      },
    },
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
      name: "showInHomePage",
      type: "checkbox",
      defaultValue: false,
      validate: async (value, { req, operation, data }) => {
        if (!value) return true;

        const existing = await req.payload.find({
          collection: "categories",
          where: {
            showInHomePage: {
              equals: true,
            },
          },
          limit: 5,
        });

        if (operation === "update") {
          const isSameDoc = existing.docs.some(
            (doc) => String(doc.id) === String(data?.id),
          );

          if (isSameDoc) return true;
        }

        if (existing.totalDocs >= 4) {
          return "Cannot have more than 4 best seller products";
        }

        return true;
      },
    },

    {
      name: "ImageSource",
      type: "radio",
      defaultValue: "upload",

      label: "Choose Image Source",
      options: [
        { value: "Url", label: "Paste Image Url" },
        { value: "upload", label: "Select Image" },
      ],
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
      label: "Select Image",

      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "upload",
        components: {
          Field: "@/components/admin/CustomMediaSelection",
        },
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        try {
          const products = await req.payload.find({
            collection: "products",
            where: {
              category: {
                equals: doc.id,
              },
            },
            limit: 0,
            depth: 0,
          });

          return {
            ...doc,
            productsCount: products.totalDocs,
          };
        } catch (error) {
          console.error(
            `Error fetching product count for category ${doc.id}:`,
            error,
          );
          return {
            ...doc,
            productsCount: 0,
          };
        }
      },
    ],
  },
};
