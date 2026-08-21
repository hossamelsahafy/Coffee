import type { CollectionConfig } from "payload";

export const Countries: CollectionConfig = {
  slug: "countries",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    components: {
      views: {
        list: {
          Component: "@/components/admin/Countries/CountriesGrid",
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
      name: "reviewCount",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
};
