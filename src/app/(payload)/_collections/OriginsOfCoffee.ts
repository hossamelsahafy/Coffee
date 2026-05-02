import type { CollectionConfig } from 'payload'

export const OriginsOfCoffee: CollectionConfig = {
  slug: 'origins-of-coffee',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'titleAr',
      type: 'text',
      required: true,
    },
  ],
}
