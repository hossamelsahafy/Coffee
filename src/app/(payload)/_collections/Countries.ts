import type { CollectionConfig } from "payload";

export const Countries: CollectionConfig = {
  slug: "countries",

  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }

      return {
        isApproved: {
          equals: true,
        },
      };
    },

    create: ({ req }) => Boolean(req.user),
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

  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        if (req.user?.role !== "admin") {
          if (operation === "create") {
            data.isApproved = false;
          }

          if (operation === "update") {
            data.isApproved = originalDoc?.isApproved ?? false;
          }
        }

        return data;
      },
    ],
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "titleAr",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "isApproved",
      type: "checkbox",
      required: true,
      defaultValue: false,
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
