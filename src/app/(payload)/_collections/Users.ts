import type { CollectionConfig } from "payload";
import { verifyEmailHTML, verifyEmailSubject } from "@/lib/Emails/VerifyEmail";
import {
  forgotPasswordHTML,
  forgotPasswordSubject,
} from "@/lib/Emails/ForgetPassword";
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",

    components: {
      views: {
        list: {
          Component: "@/components/admin/users/UserListView",
        },
      },
    },
  },
  access: {
    admin: ({ req }) => {
      return req.user?.role === "admin";
    },

    read: ({ req }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") return true;

      return {
        id: {
          equals: req.user.id,
        },
      };
    },

    create: ({ req }) => true,

    update: ({ req }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") return true;

      return {
        id: {
          equals: req.user.id,
        },
      };
    },

    delete: ({ req }) => {
      return req.user?.role === "admin";
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data;

        const siteSettings = await req.payload.findGlobal({
          slug: "site-settings",
          depth: 0,
        });

        const siteCurrency = siteSettings?.currency;

        const baseCurrency = siteCurrency?.baseCurrency?.trim().toUpperCase();

        const currencies = siteCurrency?.currencies || [];

        const enabledCurrencies = currencies
          .filter((currency) => currency?.enabled !== false)
          .map((currency) => currency?.code?.trim().toUpperCase())
          .filter(Boolean);

        if (operation === "create" && !data.SelectedCurrency) {
          if (!baseCurrency) {
            throw new Error("Site base currency is not configured.");
          }

          if (!enabledCurrencies.includes(baseCurrency)) {
            throw new Error(
              `Site base currency "${baseCurrency}" is not enabled.`,
            );
          }

          data.SelectedCurrency = baseCurrency;
        }

        if (data.SelectedCurrency !== undefined) {
          const selectedCurrency = data.SelectedCurrency?.trim().toUpperCase();

          if (!selectedCurrency) {
            throw new Error("Selected currency is required.");
          }

          if (!enabledCurrencies.includes(selectedCurrency)) {
            throw new Error(`Currency "${selectedCurrency}" is not available.`);
          }

          data.SelectedCurrency = selectedCurrency;
        }

        return data;
      },
    ],
  },
  auth: {
    verify: {
      generateEmailHTML: (args) => {
        return verifyEmailHTML({
          token: args?.token || "",
          user: args?.user,
        });
      },

      generateEmailSubject: () => {
        return verifyEmailSubject();
      },
    },

    forgotPassword: {
      generateEmailHTML: (args) => {
        return forgotPasswordHTML({
          token: args?.token || "",
          user: args?.user,
        });
      },

      generateEmailSubject: () => {
        return forgotPasswordSubject();
      },
    },
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    { name: "phoneNumber", type: "text", required: true, unique: true },

    {
      name: "gender",
      type: "select",
      options: [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
      ],
      required: true,
    },
    {
      name: "pendingEmail",
      type: "email",
      unique: true,
    },
    {
      name: "pendingEmailToken",
      type: "text",
    },
    {
      name: "pendingEmailTokenExpiresAt",
      type: "date",
    },
    {
      name: "SelectedCurrency",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "user",
      options: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
      ],
      required: true,
      access: {
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
