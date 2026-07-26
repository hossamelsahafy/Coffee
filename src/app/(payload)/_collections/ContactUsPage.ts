import type { GlobalConfig } from "payload";

export const ContactUsPage: GlobalConfig = {
  slug: "contact-us-page",
  label: "Contact Us Page",
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleAr", type: "text", required: true },
    { name: "subtitle", type: "text", required: true },
    { name: "subtitleAr", type: "text", required: true },
    { name: "PhoneNumber", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "address", type: "text", required: true },
    { name: "addressAr", type: "text", required: true },
    {
      name: "locationIframe",
      type: "textarea",
      required: true,

      admin: {
        description:
          "Paste full Google Maps iframe code (we will extract src automatically)",
      },

      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) return value;

            const isIframe = value.includes("<iframe");
            if (!isIframe) {
              throw new Error("Only iframe code is allowed");
            }

            const match = value.match(/src=["']([^"']+)["']/);
            if (!match) {
              return "Invalid iframe: missing src";
            }

            const src = match[1];

            const isGoogleMaps =
              src.includes("google.com/maps") ||
              src.includes("google.com/maps/embed");

            if (!isGoogleMaps) {
              return "Only Google Maps iframe is allowed";
            }

            return src;
          },
        ],
      },

      validate: (value) => {
        if (!value) return "Required";

        const isGoogleMaps = value.includes("google.com/maps");

        return isGoogleMaps || "Invalid Google Maps location";
      },
    },
  ],
};
