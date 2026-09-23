import type { CollectionConfig } from "payload";

export const ProductViews: CollectionConfig = {
  slug: "product-views",
  indexes: [
    {
      fields: ["user", "product"],
      unique: true,
    },
  ],
  admin: {
    useAsTitle: "id",
    defaultColumns: ["user", "product", "views", "updatedAt"],

    components: {
      views: {
        list: {
          Component: "@/components/admin/ProductsViews/ViewsList",
        },
      },
    },
  },
  hooks: {
    beforeRead: [
      async ({ req, query }) => {
        if (req.query) {
          req.query.depth = "2";
        }
      },
    ],
  },

  access: {
    create: ({ req }) => {
      return !!req.user;
    },

    read: ({ req }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") {
        return true;
      }

      return {
        user: {
          equals: req.user.id,
        },
      };
    },

    update: ({ req }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") {
        return true;
      }

      return {
        user: {
          equals: req.user.id,
        },
      };
    },

    delete: ({ req }) => {
      if (!req.user) return false;

      return req.user.role === "admin";
    },
  },

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      maxDepth: 3,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      index: true,
      maxDepth: 3,
    },
    {
      name: "views",
      type: "number",
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: "lastViewed",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],

  timestamps: true,
};

export default ProductViews;
