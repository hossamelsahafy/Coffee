import type { CollectionConfig } from "payload";
export const ProductOptions: CollectionConfig = {
  slug: "product-options",
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    components: {
      views: {
        list: {
          Component:
            "@/components/admin/ProductOptions/ProductOptionsCustomView",
        },
      },
    },
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "nameAr",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        {
          value: "color",
          label: "Color",
        },
        {
          value: "quantity",
          label: "Quantity",
        },
        {
          value: "types",
          label: "Type",
        },
        {
          value: "size",
          label: "Size",
        },
      ],
    },
  ],
};
