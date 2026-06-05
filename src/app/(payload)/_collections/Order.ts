import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",

  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin") return true;

      return {
        user: {
          equals: req.user?.id,
        },
      };
    },

    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },

  admin: {
    useAsTitle: "orderNumber",
  },

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },

    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
    },

    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        { name: "title", type: "text" },
        { name: "image", type: "text" },
        { name: "quantity", type: "number", required: true, defaultValue: 1 },
        { name: "price", type: "number" },
        { name: "total", type: "number" },
        {
          name: "selectedOptions",
          type: "text",
          admin: {
            hidden: true,
          },
        },
        { name: "optionType", type: "text" },
        { name: "optionValue", type: "text" },
      ],
    },

    {
      name: "subtotal",
      type: "number",
      label: "Total Price Of Products Without Shipping",
    },
    {
      name: "shipping",
      type: "group",
      fields: [
        {
          name: "zone",
          type: "relationship",
          relationTo: "shipping-zones",
          required: true,
        },
        {
          name: "city",
          type: "text",
        },
        {
          name: "price",
          type: "number",
        },
      ],
    },
    { name: "total", type: "number", label: "Total Price With Shipping" },

    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },

    {
      name: "payment",
      type: "group",
      fields: [
        {
          name: "method",
          type: "select",
          required: true,
          options: [
            { label: "Cash", value: "cash" },
            { label: "Stripe", value: "stripe" },
          ],
        },
        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Failed", value: "failed" },
            { label: "Refunded", value: "refunded" },
          ],
        },
        {
          name: "transactionId",
          type: "text",
        },
        { name: "stripePaymentIntentId", type: "text" },
      ],
    },
    {
      name: "customer",
      type: "group",
      fields: [
        { name: "firstName", type: "text" },
        { name: "lastName", type: "text" },
        { name: "phone", type: "text" },
        { name: "email", type: "email" },
      ],
    },

    { name: "paidAt", type: "date" },
    { name: "shippedAt", type: "date" },
    { name: "deliveredAt", type: "date" },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        if (!req.user) return data;

        if (req.user.role !== "admin") {
          data.user = req.user.id;

          data.customer = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            phone: req.user.phoneNumber,
            email: req.user.email,
          };
        }

        if (!data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}`;
        }

        data.items = await Promise.all(
          data.items.map(async (item) => {
            const product = await req.payload.findByID({
              collection: "products",
              id: item.product,
            });

            const option = product.choices.options?.find(
              (opt) => String(opt.id) === String(item.selectedOptions),
            );
            console.log(item.selectedOptions);

            const price = option?.priceAfter ?? 0;
            const image =
              option?.ImageSource === "Url"
                ? option.imageUrl
                : option?.image?.url;
            const optionType = product.choices.choiceType;
            const optionValue = option?.value;
            const quantity = Number(item.quantity) || 0;

            return {
              ...item,
              price: price,
              image: image,
              optionValue: optionValue,
              optionType: optionType,
              total: price * quantity,
            };
          }),
        );
        const itemsTotal =
          data.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

        let shippingPrice = 0;

        const zoneId =
          typeof data.shipping?.zone === "string"
            ? data.shipping.zone
            : data.shipping?.zone?.id;

        if (zoneId) {
          const zone = await req.payload.findByID({
            collection: "shipping-zones",
            id: zoneId,
          });

          shippingPrice = Number(zone?.shippingPrice || 0);
          data.shipping.city = zone.cityName;
          data.shipping.price = shippingPrice;
        }

        data.subtotal = itemsTotal;
        data.total = itemsTotal + shippingPrice;

        return data;
      },
    ],
  },
};
