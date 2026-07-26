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

    delete: ({ req, doc }) => {
      if (!req.user) return false;

      if (req.user.role === "admin") return true;

      if (!doc) return false;

      return req.user.id === doc.id;
    },
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
    { name: "phoneNumber", type: "text", required: true },
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
