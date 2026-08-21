import type { CollectionConfig } from "payload";
import {
  syncCountryReviewCount,
  syncCountryReviewCountAfterDelete,
} from "@/hooks/syncCountryReviewCount";
export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: () => true,

    create: ({ req }) => Boolean(req.user),

    update: ({ req }) => Boolean(req.user),

    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data?.product && data?.productOption) {
          try {
            const productId =
              typeof data.product === "object" ? data.product.id : data.product;
            const product = await req.payload.findByID({
              collection: "products",
              id: productId,
              depth: 1,
            });

            if (product?.choices?.options) {
              const matchedOption = product.choices.options.find(
                (opt: any) => String(opt.id) === String(data.productOption),
              );

              if (matchedOption) {
                data.image = {
                  ImageSource: matchedOption.ImageSource || null,
                  image: matchedOption.image || null,
                  imageUrl: matchedOption.imageUrl || null,
                };
              }
            }
          } catch (error) {
            console.error("Error auto-syncing product option image:", error);
          }
        }
        return data;
      },
    ],
    afterChange: [syncCountryReviewCount],
    afterDelete: [syncCountryReviewCountAfterDelete],
  },
  admin: {
    useAsTitle: "title",
    components: {
      views: {
        list: {
          Component: "@/components/admin/Reviews/ReviewsGrid",
        },
      },
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "titleAr",
      type: "text",
    },
    {
      name: "subtitle",
      type: "text",
      required: true,
    },
    {
      name: "subtitleAr",
      type: "text",
    },
    {
      name: "des",
      type: "text",
      required: true,
    },
    {
      name: "desAr",
      type: "text",
      required: true,
    },
    {
      name: "country",
      type: "relationship",
      relationTo: "countries",
    },
    {
      name: "rate",
      type: "number",
      min: 0,
      max: 5,
    },
    {
      name: "ClientName",
      type: "relationship",
      relationTo: "users",
    },

    {
      name: "isApproved",
      type: "checkbox",
      defaultValue: false,
      label: "Approved",
      access: {
        update: ({ req }) => req.user?.role === "admin",
      },
    },

    {
      name: "product",
      type: "relationship",
      relationTo: "products",
    },
    {
      name: "productOption",
      type: "text",
      label: "Product Option",
      admin: {
        components: {
          Field: "@/components/admin/Reviews/ProductOptionField",
        },
      },
    },
    {
      name: "image",
      type: "group",
      fields: [
        {
          name: "ImageSource",
          type: "select",
          defaultValue: "Upload",

          options: [
            { value: "upload", label: "Upload" },
            { value: "Url", label: "URL" },
          ],
          admin: {
            readOnly: true,
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "imageUrl",
          type: "text",
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
};
