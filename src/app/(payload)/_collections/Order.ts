import type { CollectionConfig } from "payload";
import { roundMoney } from "@/lib/currency/roundMoney";
import {
  orderAdminHTML,
  orderAdminSubject,
} from "@/lib/Emails/OrderAdminConfirmation";

import {
  orderConfirmationHTML,
  orderConfirmationSubject,
} from "@/lib/Emails/OrderConfirmation";
import { createCurrencySnapshot } from "@/lib/currency/createCurrencySnapshot";
type OrderItemData = {
  product: string | { id: string };
  optionValue: string | { id: string };
  quantity?: number | null;
  title?: string | null;
  image?: string | null;
  price?: number | null;
  total?: number | null;
  optionType?: string | null;
};
export const Orders: CollectionConfig = {
  slug: "orders",

  access: {
    read: ({ req }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") return true;

      return {
        user: {
          equals: req.user.id,
        },
      };
    },

    create: ({ req }) => {
      return !!req.user;
    },

    update: ({ req }) => req.user?.role === "admin",

    delete: ({ req }) => req.user?.role === "admin",
  },

  admin: {
    useAsTitle: "orderNumber",

    components: {
      views: {
        list: {
          Component: "@/components/admin/Orders/OrdersViewList",
        },
      },
    },

    pagination: {
      defaultLimit: 12,
      limits: [8, 12, 24, 50],
    },
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

        {
          name: "title",
          type: "text",
        },

        {
          name: "image",
          type: "text",
        },

        {
          name: "quantity",
          type: "number",
          required: true,
          defaultValue: 1,
        },

        {
          name: "price",
          type: "number",
        },

        {
          name: "total",
          type: "number",
        },

        {
          name: "optionValue",
          type: "relationship",
          relationTo: "product-options",
          required: true,
        },

        {
          name: "optionType",
          type: "text",
        },
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

    {
      name: "total",
      type: "number",
      label: "Total Price With Shipping",
    },
    {
      name: "baseCurrency",
      type: "text",
      required: true,
      defaultValue: "USD",
      admin: {
        readOnly: true,
        description:
          "Base currency used when this order was created. This value is preserved for historical accuracy.",
      },
    },
    {
      name: "currency",
      type: "text",
      required: true,
      defaultValue: "USD",
      admin: {
        readOnly: true,
        description: "Currency used when this order was created.",
      },
    },
    {
      name: "currencySymbol",
      type: "text",
      required: true,
      defaultValue: "$",
      admin: {
        readOnly: true,
        description: "Currency Symbol used when this order was created.",
      },
    },
    {
      name: "exchangeRate",
      type: "number",
      required: true,
      admin: {
        readOnly: true,
        description:
          "Exchange rate used when this order was created. This value is preserved for historical accuracy.",
      },
    },
    {
      name: "currencySnapshot",
      type: "group",
      admin: {
        readOnly: true,
        description:
          "Historical currency rates captured when this order was created.",
      },
      fields: [
        {
          name: "baseCurrency",
          type: "text",
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "rates",
          type: "json",
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "capturedAt",
          type: "date",
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Processing",
          value: "processing",
        },
        {
          label: "Shipped",
          value: "shipped",
        },
        {
          label: "Delivered",
          value: "delivered",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
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
            {
              label: "Cash",
              value: "cash",
            },
            {
              label: "Stripe",
              value: "stripe",
            },
          ],
        },

        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Paid",
              value: "paid",
            },
            {
              label: "Failed",
              value: "failed",
            },
            {
              label: "Refunded",
              value: "refunded",
            },
            {
              label: "Cash on Delivery",
              value: "cash_on_delivery",
            },
          ],
        },

        {
          name: "stripePaymentIntentId",
          type: "text",
        },
      ],
    },

    {
      name: "customer",
      type: "group",
      fields: [
        {
          name: "firstName",
          type: "text",
        },

        {
          name: "lastName",
          type: "text",
        },

        {
          name: "phone",
          type: "text",
        },

        {
          name: "email",
          type: "email",
        },
      ],
    },

    {
      name: "paidAt",
      type: "date",
    },

    {
      name: "shippedAt",
      type: "date",
    },

    {
      name: "deliveredAt",
      type: "date",
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data, operation, originalDoc }) => {
        if (!req.user) return data;

        data.user = req.user.id;

        data.customer = {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          phone: req.user.phoneNumber,
          email: req.user.email,
        };

        if (operation === "create") {
          const siteSettings = await req.payload.findGlobal({
            slug: "site-settings",
            depth: 0,
          });

          const baseCurrency = siteSettings?.currency?.baseCurrency
            ?.trim()
            .toUpperCase();

          if (!baseCurrency) {
            throw new Error("Store base currency is not configured.");
          }

          const selectedCurrency = data.currency?.trim().toUpperCase();

          const currencyCode = selectedCurrency || baseCurrency;

          const currencies = siteSettings?.currency?.currencies || [];

          const configuredCurrency = currencies.find(
            (currency) => currency?.code?.trim().toUpperCase() === currencyCode,
          );

          if (!configuredCurrency) {
            throw new Error(`Currency "${currencyCode}" is not configured.`);
          }

          if (configuredCurrency.enabled === false) {
            throw new Error(`Currency "${currencyCode}" is not available.`);
          }

          const orderCreatedAt = new Date();

          const orderDate = orderCreatedAt.toISOString().split("T")[0];

          const currencySnapshot = await createCurrencySnapshot(
            baseCurrency,
            currencies.filter((currency) => currency?.enabled !== false),
            orderDate,
            orderCreatedAt.toISOString(),
          );

          const exchangeRate = currencySnapshot.rates[currencyCode];

          if (!exchangeRate) {
            throw new Error(
              `Exchange rate for ${baseCurrency} to ${currencyCode} is not available.`,
            );
          }

          data.currencySnapshot = currencySnapshot;

          data.baseCurrency = baseCurrency;
          data.currency = currencyCode;
          data.currencySymbol = configuredCurrency.symbol;
          data.exchangeRate = exchangeRate;

          if (!data.orderNumber) {
            data.orderNumber = `ORD-${Date.now()}`;
          }

          if (data.payment?.method === "cash") {
            data.payment.status = "cash_on_delivery";
          } else if (data.payment?.method === "stripe") {
            data.payment.status = "pending";
          }

          data.items = await Promise.all(
            (data.items as OrderItemData[]).map(async (item) => {
              const productId =
                typeof item.product === "string"
                  ? item.product
                  : item.product.id;

              const optionValueId =
                typeof item.optionValue === "string"
                  ? item.optionValue
                  : item.optionValue.id;

              const product = await req.payload.findByID({
                collection: "products",
                id: productId,
              });

              const option = product.choices.options?.find((opt) => {
                const valueId =
                  typeof opt.value === "string" ? opt.value : opt.value?.id;

                return String(valueId) === String(optionValueId);
              });

              if (!option) {
                throw new Error(
                  `Product option "${optionValueId}" was not found for product "${product.id}".`,
                );
              }

              const basePrice = Number(option.priceAfter ?? 0);
              const convertedPrice = roundMoney(basePrice * exchangeRate);

              const image =
                option.ImageSource === "Url"
                  ? option.imageUrl
                  : typeof option.image === "string"
                    ? undefined
                    : option.image?.url;

              const optionType = product.choices.choiceType;
              const quantity = Number(item.quantity) || 0;
              const itemTotal = roundMoney(convertedPrice * quantity);

              return {
                ...item,
                price: convertedPrice,
                image,
                optionType,
                total: itemTotal,
              };
            }),
          );

          const itemsTotal = roundMoney(
            (data.items as OrderItemData[] | undefined)?.reduce(
              (sum: number, item: OrderItemData) =>
                sum + Number(item.total || 0),
              0,
            ) || 0,
          );
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

            const baseShippingPrice = Number(zone?.shippingPrice || 0);
            shippingPrice = roundMoney(baseShippingPrice * exchangeRate);
            data.shipping = {
              ...data.shipping,
              city: zone.cityName,
              price: shippingPrice,
            };
          }

          data.subtotal = itemsTotal;
          data.total = roundMoney(itemsTotal + shippingPrice);
        }

        if (operation === "update") {
          data.orderNumber = originalDoc.orderNumber;

          if (!data.payment?.method) {
            data.payment = originalDoc.payment;
          }
        }

        return data;
      },
    ],

    afterChange: [
      async ({ doc, req }) => {
        if (
          doc.payment?.method === "stripe" &&
          (doc.payment?.status === "pending" ||
            doc.payment?.status === "failed")
        ) {
          const job = await req.payload.jobs.queue({
            task: "cancelUnpaidOrder",
            input: {
              orderId: doc.id,
            },
            waitUntil: new Date(Date.now() + 3 * 60 * 1000),
          });
        }

        const paymentMethod =
          doc.payment?.method === "stripe" ? "Stripe" : "Cash";

        const orderState =
          doc.payment?.method === "stripe" ? "pending_payment" : "confirmed";

        await Promise.all([
          req.payload.sendEmail({
            to: doc.customer.email,

            subject: orderConfirmationSubject(doc.orderNumber, orderState),

            html: orderConfirmationHTML({
              firstName: doc.customer.firstName,
              orderNumber: doc.orderNumber,
              total: doc.total,
              paymentMethod,
              orderState,
              currencySymbol: doc.currencySymbol,
            }),
          }),

          req.payload.sendEmail({
            to: process.env.ADMIN_EMAIL!,

            subject: orderAdminSubject(doc.orderNumber),

            html: orderAdminHTML({
              firstName: doc.customer.firstName,
              lastName: doc.customer.lastName,
              email: doc.customer.email,
              phone: doc.customer.phone,
              orderNumber: doc.orderNumber,
              paymentMethod,
              total: doc.total,
              currency: doc.currency,
            }),
          }),
        ]);
      },
    ],
  },
};
