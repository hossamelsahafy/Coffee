import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: false,
  fields: [
    { name: 'alt', type: 'text', required: true },
    {
      name: 'sourceType',
      type: 'radio',
      required: true,
      defaultValue: 'upload',
      options: [
        { label: 'Upload Image', value: 'upload' },
        { label: 'Image URL', value: 'url' },
      ],
    },
    {
      name: 'uploadedImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { condition: (data) => data.sourceType === 'upload' },
    },
    {
      name: 'imageUrl',
      type: 'text',
      required: true,
      admin: { condition: (data) => data.sourceType === 'url' },
    },
  ],
}
