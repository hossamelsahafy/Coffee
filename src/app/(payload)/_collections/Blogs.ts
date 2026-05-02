import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
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
    {
      name: 'subtitle',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitleAr',
      type: 'text',
      required: true,
    },
    {
      name: 'des',
      type: 'text',
      required: true,
    },
    {
      name: 'desAr',
      type: 'text',
      required: true,
    },
    {
      name: 'OriginsOfCoffee',
      type: 'relationship',
      relationTo: 'origins-of-coffee',
    },
    {
      name: 'ImageUrl',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'rate',
      type: 'number',
      min: 0,
      max: 5,
    },
    { name: 'clientName', type: 'text' },

    { name: 'clientNameAr', type: 'text' },
  ],
}
