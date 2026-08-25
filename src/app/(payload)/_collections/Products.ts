import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",

    defaultColumns: ["title", "category", "isBestSeller", "updatedAt"],

    components: {
      views: {
        list: {
          Component: "@/components/admin/Products/ProductsListView",
        },
      },
    },
    pagination: {
      defaultLimit: 12,
      limits: [8, 12, 24, 50],
    },
  },

  access: { read: () => true },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleAr", type: "text" },
    { name: "subtitle", type: "text" },
    { name: "subtitleAr", type: "text" },
    { name: "longDes", type: "text" },
    { name: "longDesAr", type: "text" },

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
      name: "isNewest",
      type: "checkbox",
      required: true,
      label: "Choose if that product is new",
      defaultValue: false,
    },
    {
      name: "ShowInDiscountSection",
      label: "Choose if you need that project in Discount Section",
      type: "checkbox",
      defaultValue: false,
      required: true,
      validate: async (value, { req, operation, siblingData }) => {
        if (!value) return true;

        const count = await req.payload.find({
          collection: "products",
          where: { ShowInDiscountSection: { equals: true } },
          limit: 0,
        });

        const currentId = siblingData?.id;
        const total =
          currentId && operation === "update"
            ? count.totalDocs - 1
            : count.totalDocs;

        if (total >= 12) {
          return "Cannot have more than 12 discount products";
        }

        return true;
      },
    },
    {
      name: "important",
      type: "checkbox",
      label: "Important Product",
      defaultValue: false,
      validate: async (value, { req, operation, siblingData }) => {
        if (!value) return true;

        const count = await req.payload.find({
          collection: "products",
          where: { important: { equals: true } },
          limit: 0,
        });

        const currentId = siblingData?.id;
        const total =
          currentId && operation === "update"
            ? count.totalDocs - 1
            : count.totalDocs;

        if (total >= 2) {
          return "Cannot have more than 2 important products";
        }

        return true;
      },
    },
    {
      name: "isBestSeller",
      defaultValue: false,
      type: "checkbox",
      validate: async (value, { req, operation, data }) => {
        if (!value) return true;

        const existing = await req.payload.find({
          collection: "products",
          where: {
            isBestSeller: { equals: true },
          },
        });

        if (existing.totalDocs === 0) return true;

        if (operation === "update") {
          const isSameDoc = existing.docs.some((doc) => doc.id === data?.id);
          if (isSameDoc) return true;
        }

        return "Cannot have more than 1 best seller product";
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      hasMany: false,
    },
    { name: "type", type: "text" },
    { name: "typeAr", type: "text" },

    {
      name: "choices",
      type: "group",
      fields: [
        {
          name: "choiceType",
          type: "select",
          required: true,
          options: [
            { value: "color", label: "Color" },
            { value: "quantity", label: "Quantity" },
            { value: "types", label: "Types" },
            { value: "size", label: "Size" },
          ],
        },
        {
          name: "choiceTypeAr",
          type: "select",
          required: true,
          options: [
            { value: "لون", label: "الوان" },
            { value: "كمية", label: "اعداد" },
            { value: "نوع", label: "انواع" },
            { value: "حجم", label: "احجام" },
          ],
        },

        {
          name: "options",
          type: "array",
          fields: [
            { name: "value", type: "text", required: true },
            { name: "valueAr", type: "text", required: true },
            {
              name: "availability",
              type: "radio",
              defaultValue: "inStock",
              options: [
                { value: "inStock", label: "In Stock" },
                { value: "outOfStock", label: "Out of Stock" },
              ],
            },
            { name: "priceAfter", type: "number", required: true },
            { name: "priceBefore", type: "number", required: true },
            {
              name: "ImageSource",
              type: "radio",
              defaultValue: "upload",

              options: [
                { value: "Url", label: "Paste Image Url" },
                { value: "upload", label: "Select Image" },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Select Image",
              required: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "upload",
                components: {
                  Field: "@/components/admin/CustomMediaSelection",
                },
              },
            },
            {
              name: "imageUrl",
              type: "text",
              label: "Paste Image Url",
              required: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "Url",
              },
            },
          ],
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
        },

        {
          name: "ImageSource",
          type: "radio",
          label: "SEO Image Source",
          defaultValue: "upload",
          options: [
            {
              label: "URL",
              value: "Url",
            },
            {
              label: "Select",
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
          label: "SEO Select Image",
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

export default Products;
