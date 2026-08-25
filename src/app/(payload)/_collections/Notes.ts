import type { CollectionConfig } from "payload";

export const Notes: CollectionConfig = {
  slug: "Notes",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    pagination: {
      defaultLimit: 6,
      limits: [8, 12, 24, 50],
    },
    components: {
      views: {
        list: {
          Component: "@/components/admin/Notes/NotesGrid",
        },
      },
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "titleAr", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      validate: (value) => {
        if (!value) return "Slug is required";

        const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

        if (!isValid) {
          return "Slug must be lowercase, no spaces, use hyphens (-), No Special Characters";
        }

        return true;
      },
    },
    {
      name: "slugAr",
      type: "text",
      unique: true,
      required: true,
      validate: (value) => {
        if (!value) return "Slug is required";

        const isValid = /^[\u0600-\u06FF0-9]+(?:-[\u0600-\u06FF0-9]+)*$/.test(
          value,
        );

        if (!isValid) {
          return "Slug must be Arabic letters/numbers separated by hyphens";
        }

        return true;
      },
    },
    { name: "des", type: "text", required: true },
    { name: "desAr", type: "text", required: true },
    { name: "longDes", type: "richText", required: true },
    { name: "lonDesAr", type: "richText", required: true },
    { name: "brandName", type: "text", required: true },
    { name: "brandNameAr", type: "text", required: true },
    {
      name: "isImportant",
      label: "Choose If U Need The Element To Appear In Home Page",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "ImageSource",
      type: "radio",
      required: true,
      defaultValue: "upload",
      options: [
        { value: "Url", label: "Paste Image Url" },
        { value: "upload", label: "Select Image" },
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
      label: "Select Image",
      type: "relationship",
      relationTo: "media",
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === "upload",
        components: {
          Field: "@/components/admin/CustomMediaSelection",
        },
      },
    },
    {
      name: "SEO",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta Title",
          admin: {
            description:
              "SEO title for search engines. Recommended: 50–60 characters.",
          },
        },

        {
          name: "metaTitleAr",
          type: "text",
          label: "Meta Title (Arabic)",
          admin: {
            description: "Arabic SEO title. Recommended: 50–60 characters.",
          },
        },

        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta Description",
          admin: {
            description:
              "SEO description for search engines. Recommended: 150–160 characters.",
          },
        },

        {
          name: "metaDescriptionAr",
          type: "textarea",
          label: "Meta Description (Arabic)",
          admin: {
            description:
              "Arabic SEO description. Recommended: 150–160 characters.",
          },
        },

        {
          name: "keywords",
          type: "array",
          label: "Keywords",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
        },

        {
          name: "keywordsAr",
          type: "array",
          label: "Keywords (Arabic)",
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
        },

        {
          name: "ImageSource",
          type: "select",
          label: "SEO Image Source",
          defaultValue: "upload",
          options: [
            {
              label: "URL",
              value: "Url",
            },
            {
              label: "Select",
              value: "upload",
            },
          ],
        },

        {
          name: "ImageUrl",
          type: "text",
          label: "SEO Image URL",
          admin: {
            condition: (_, siblingData) => siblingData?.ImageSource === "Url",
          },
        },

        {
          name: "ImageUpload",
          type: "relationship",
          label: "SEO Select Image",
          relationTo: "media",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.ImageSource === "upload",
            components: {
              Field: "@/components/admin/CustomMediaSelection",
            },
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.isImportant) return data;

        const result = await req.payload.find({
          collection: "Notes",
          where: {
            isImportant: {
              equals: true,
            },
          },
          limit: 0,
        });

        let total = result.totalDocs;

        if (operation === "update" && originalDoc?.isImportant) {
          total--;
        }

        if (total >= 4) {
          return "Cannot have more than 4 important notes";
        }
        return data;
      },
    ],
  },
};
