import type { CollectionConfig } from "payload";
import {
  syncCountryReviewCount,
  syncCountryReviewCountAfterDelete,
} from "@/hooks/syncCountryReviewCount";
export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }
      return {
        isApproved: {
          equals: true,
        },
      };
    },

    create: ({ req }) => Boolean(req.user),

    update: ({ req }) => Boolean(req.user),

    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (!req.user || req.user.role !== "admin") {
          data.isApproved = false;
        }
        if (req.user) {
          if (operation === "create") {
            data.ClientName = req.user.id;
          }
        }

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
                let imageId = null;

                if (matchedOption.image) {
                  if (typeof matchedOption.image === "string") {
                    imageId = matchedOption.image;
                  } else if (
                    typeof matchedOption.image === "object" &&
                    matchedOption.image.id
                  ) {
                    imageId = String(matchedOption.image.id);
                  }
                }

                data.image = {
                  ImageSource: matchedOption.ImageSource || "upload",

                  image: imageId,

                  imageUrl:
                    typeof matchedOption.imageUrl === "string"
                      ? matchedOption.imageUrl
                      : null,
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
    },
    {
      name: "titleAr",
      type: "text",
    },
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "subtitleAr",
      type: "text",
    },
    {
      name: "des",
      type: "text",
    },
    {
      name: "desAr",
      type: "text",
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
      validate: (value: number | null | undefined) => {
        if (value == null) return true;

        if (value > 5) {
          return "Rating cannot exceed 5.";
        }

        if (value < 0) {
          return "Rating cannot be less than 0.";
        }

        return true;
      },
    },
    {
      name: "ClientName",
      type: "relationship",
      relationTo: "users",
      admin: {
        readOnly: true,
      },
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
          defaultValue: "upload",

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
            condition: (_, siblingData) =>
              siblingData?.ImageSource === "upload",
            readOnly: true,
          },
        },
        {
          name: "imageUrl",
          type: "text",
          admin: {
            condition: (_, siblingData) => siblingData?.ImageSource === "Url",
            readOnly: true,
          },
        },
      ],
    },
  ],
};
