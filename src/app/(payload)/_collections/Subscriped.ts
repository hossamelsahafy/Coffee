import type { CollectionConfig } from "payload";

export const Subscripe: CollectionConfig = {
  slug: "Subscripe",
  admin: {
    components: {
      views: {
        list: {
          Component: "@/components/admin/Subscripes/SubscripesGrid",
        },
      },
    },
  },
  access: { read: () => true, create: () => true },
  fields: [{ name: "Email", required: true, unique: true, type: "email" }],
};
