import type { CollectionConfig } from "payload";

export const ShippingZones: CollectionConfig = {
  slug: "shipping-zones",
  access: { read: () => true },
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
