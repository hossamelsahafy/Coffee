import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  access: { read: () => true },

  fields: [
    // ===== Basic Info =====
    { name: 'title', type: 'text', required: true },
    { name: 'titleAr', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'subtitleAr', type: 'text' },
    {
      name: 'isNewest',
      type: 'checkbox',
      required: true,
      label: 'Choose if that product is new',
      defaultValue: false,
    },
    {
      name: 'ShowInDiscountSection',
      label: 'Choose if you need that project in Discount Section',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'important',
      type: 'checkbox',
      label: 'Important Product',
      defaultValue: false,
      validate: async (value, { req, operation, siblingData }) => {
        if (!value) return true

        const count = await req.payload.find({
          collection: 'products',
          where: { important: { equals: true } },
          limit: 0,
        })

        const currentId = siblingData?.id
        const total = currentId && operation === 'update' ? count.totalDocs - 1 : count.totalDocs

        if (total >= 2) {
          return 'Cannot have more than 2 important products'
        }

        return true
      },
    },
    {
      name: 'isBestSeller',
      defaultValue: false,
      type: 'checkbox',
      validate: async (value, { req, operation, data }) => {
        if (!value) return true

        const existing = await req.payload.find({
          collection: 'products',
          where: {
            isBestSeller: { equals: true },
          },
        })

        if (existing.totalDocs === 0) return true

        if (operation === 'update') {
          const isSameDoc = existing.docs.some((doc) => doc.id === data?.id)
          if (isSameDoc) return true
        }

        return 'Cannot have more than 1 best seller product'
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    { name: 'type', type: 'text' },
    { name: 'typeAr', type: 'text' },

    // ===== Options Type =====
    {
      name: 'optionsType',
      type: 'radio',
      required: true,
      options: [
        { label: 'Choices (Coffee options)', value: 'choices' },
        { label: 'Colors', value: 'colors' },
      ],
    },

    // ===== Choices =====
    {
      name: 'choices',
      type: 'array',
      admin: {
        condition: (data) => data.optionsType === 'choices',
      },
      fields: [
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'valueAr', type: 'text', required: true },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            { name: 'priceAfter', type: 'number', required: true },
            { name: 'priceBefore', type: 'number', required: true },
          ],
        },
      ],
    },

    // ===== Colors =====
    {
      name: 'colors',
      type: 'array',
      admin: {
        condition: (data) => data.optionsType === 'colors',
      },
      fields: [
        { name: 'en', type: 'text', required: true },
        { name: 'ar', type: 'text', required: true },
        { name: 'priceAfter', type: 'number', required: true },
        { name: 'priceBefore', type: 'number', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default Products
