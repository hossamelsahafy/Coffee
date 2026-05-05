import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
  },
  access: { read: () => true },

  fields: [
    // ===== Basic Info =====
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
            {
              name: "ImageSource",
              type: "radio",
              options: [
                { value: "Url", label: "Paste Image Url" },
                { value: "upload", label: "upload Image" },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "upload",
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
            { name: "priceAfter", type: "number", required: true },
            { name: "priceBefore", type: "number", required: true },
          ],
        },
      ],
    },
  ],
};

export default Products;
