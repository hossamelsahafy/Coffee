import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    components: {
      elements: {
        SaveButton: "@/components/admin/BaseCurrencySaveButton",
      },
    },
  },

  access: {
    read: () => true,
  },

  hooks: {
    beforeChange: [
      async ({ data }) => {
        const incomingBaseCurrency = data?.currency?.baseCurrency
          ?.trim()
          .toUpperCase();

        const currencies = data?.currency?.currencies || [];

        if (!incomingBaseCurrency) {
          throw new Error("Base currency is required.");
        }

        const normalizedCurrencies = currencies.map((currency) => ({
          ...currency,
          code: currency.code?.trim().toUpperCase(),
        }));

        const codes = normalizedCurrencies
          .map((currency) => currency.code)
          .filter(Boolean);

        const uniqueCodes = new Set(codes);

        if (uniqueCodes.size !== codes.length) {
          throw new Error("Duplicate currency codes are not allowed.");
        }

        const baseCurrencyData = normalizedCurrencies.find(
          (currency) => currency.code === incomingBaseCurrency,
        );

        if (!baseCurrencyData) {
          throw new Error(
            `Base currency "${incomingBaseCurrency}" must match one of the configured currencies.`,
          );
        }

        return {
          ...data,
          currency: {
            ...data.currency,

            baseCurrency: incomingBaseCurrency,

            // Get symbol from the existing currency data
            baseCurrencySymbol: baseCurrencyData.symbol,

            currencies: normalizedCurrencies,
          },
        };
      },
    ],
  },

  fields: [
    {
      name: "websiteUrl",
      type: "text",
      required: true,
      admin: {
        description:
          "Enter the full website URL, for example https://example.com",
      },
    },

    {
      name: "siteName",
      type: "text",
      required: true,
    },

    {
      name: "siteNameAr",
      type: "text",
      required: true,
    },

    {
      name: "description",
      type: "textarea",
    },

    {
      name: "descriptionAr",
      type: "textarea",
    },

    {
      name: "currency",
      type: "group",
      fields: [
        {
          name: "baseCurrency",
          type: "text",
          required: true,
          defaultValue: "USD",

          admin: {
            description:
              "Main currency used for product prices and currency conversions.",

            components: {
              Field: "@/components/admin/BaseCurrencyField",
            },
          },

          validate: (value, { siblingData }) => {
            if (!value) {
              return "Base currency is required.";
            }

            const normalizedValue = value.trim().toUpperCase();

            if (!/^[A-Za-z]{3}$/.test(normalizedValue)) {
              return "Base currency must be exactly 3 letters.";
            }

            const currencies = siblingData?.currencies || [];

            const exists = currencies.some(
              (currency) =>
                currency?.code?.trim().toUpperCase() === normalizedValue,
            );

            if (!exists) {
              return "Base currency must match one of the configured currencies.";
            }

            return true;
          },
        },
        {
          name: "baseCurrencySymbol",
          type: "text",
          admin: {
            readOnly: true,
            description: "Symbol of the selected base currency.",
          },
        },

        {
          name: "currencies",
          type: "array",
          minRows: 1,

          fields: [
            {
              name: "code",
              type: "text",
              required: true,

              admin: {
                description:
                  "3-letter ISO currency code, for example USD, EUR, GBP.",
              },

              validate: (value) => {
                if (!value) {
                  return "Currency code is required.";
                }

                if (!/^[A-Za-z]{3}$/.test(value.trim())) {
                  return "Currency code must be exactly 3 letters.";
                }

                return true;
              },
            },

            {
              name: "symbol",
              type: "text",
              required: true,
            },

            {
              name: "ImageSource",
              type: "radio",
              required: true,

              options: [
                {
                  value: "Url",
                  label: "Paste Image URL",
                },
                {
                  value: "upload",
                  label: "Upload Image",
                },
              ],
            },

            {
              name: "imageUrl",
              type: "text",

              admin: {
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "Url",

                description: "Currency image URL.",
              },
            },

            {
              name: "image",
              type: "relationship",
              relationTo: "media",

              admin: {
                condition: (_, siblingData) =>
                  siblingData?.ImageSource === "upload",

                components: {
                  Field: "@/components/admin/CustomMediaSelection",
                },
              },
            },

            {
              name: "enabled",
              type: "checkbox",
              defaultValue: true,
            },
          ],
        },
      ],
    },

    {
      name: "ImageSource",
      type: "radio",
      required: true,

      options: [
        {
          value: "Url",
          label: "Paste Image URL",
        },
        {
          value: "upload",
          label: "Upload Image",
        },
      ],
    },

    {
      name: "ImageUrl",
      label: "Paste Image URL",
      type: "text",

      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "Url",
      },
    },

    {
      name: "ImageUpload",
      label: "Upload Image",
      type: "relationship",
      relationTo: "media",

      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "upload",

        components: {
          Field: "@/components/admin/CustomMediaSelection",
        },
      },
    },
  ],
};
