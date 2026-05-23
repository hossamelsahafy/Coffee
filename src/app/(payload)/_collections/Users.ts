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
      name: "role",
      type: "select",
      defaultValue: "user",
      options: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
      ],
      required: true,
    },
  ],
};
