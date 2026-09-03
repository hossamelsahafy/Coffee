import type { CollectionConfig } from "payload";

export const Brands: CollectionConfig = {
  slug: "brands",
  access: { read: () => true },
  admin: {
    useAsTitle: "name",
    components: {
      views: {
        list: {
          Component: "@/components/admin/brands/brandsGrid",
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
  ],
};
