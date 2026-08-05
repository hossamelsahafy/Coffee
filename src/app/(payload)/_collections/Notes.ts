import type { CollectionConfig } from "payload";
import { ValidationError } from "payload";

export const Notes: CollectionConfig = {
  slug: "Notes",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
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
    { name: "des", type: "text", required: true },
    { name: "desAr", type: "text", required: true },
    { name: "brandName", type: "text", required: true },
    { name: "brandNameAr", type: "text", required: true },
    {
      name: "ImageSource",
      type: "radio",
      required: true,
      options: [
        { value: "Url", label: "Paste Image Url" },
        { value: "upload", label: "UploadImage" },
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
      },
    },
    {
      name: "isImportant",
      label: "Choose If U Need The Element To Appear In Home Page",
      type: "checkbox",
      defaultValue: false,
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
