import type { CollectionConfig } from "payload";

export const ShippingZones: CollectionConfig = {
  slug: "shipping-zones",
  access: { read: () => true },
  admin: {
    components: {
      views: {
        list: {
          Component: "@/components/admin/ShippingZones/ShippingZonesGrid",
        },
      },
    },
  },
  fields: [
    {
      name: "cityName",
      type: "text",
      required: true,
    },
    {
      name: "cityNameAr",
      type: "text",
      required: true,
    },
    {
      name: "shippingPrice",
      type: "number",
      required: true,
    },
  ],
};
