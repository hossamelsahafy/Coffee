import { CollectionConfig } from "payload";

export const Favorites: CollectionConfig = {
  slug: "favorites",
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user?.role === "admin") return true;
      return { user: { equals: req.user.id } };
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user?.role === "admin") return true;
      return { user: { equals: req.user.id } };
    },
    delete: ({ req }) => {
      if (!req.user) return false;
      if (req.user?.role === "admin") return true;
      return { user: { equals: req.user.id } };
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (req.user && data) data.user = req.user.id;
        return data;
      },
    ],
  },
  admin: {
    components: {
      views: {
        list: {
          Component: "@/components/admin/Favorites/FavoritesViewsList",
        },
      },
    },
  },
  endpoints: [
    {
      path: "/product/:productId",
      method: "delete",
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = req.routeParams;

        const result = await req.payload.delete({
          collection: "favorites",
          where: {
            and: [
              { product: { equals: productId } },
              { user: { equals: req.user.id } },
            ],
          },
        });

        return Response.json({
          success: true,
          deletedCount: result.docs.length,
        });
      },
    },
  ],
  fields: [
    { name: "user", type: "relationship", relationTo: "users", required: true },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
  ],
};
