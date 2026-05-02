import type { CollectionConfig } from 'payload'
export const Notes: CollectionConfig = {
  slug: 'Notes',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleAr', type: 'text', required: true },
    { name: 'des', type: 'text', required: true },
    { name: 'desAr', type: 'text', required: true },
    { name: 'brandName', type: 'text', required: true },
    { name: 'brandNameAr', type: 'text', required: true },
    {
      name: 'ImageSource',
      type: 'radio',
      required: true,
      options: [
        { value: 'Url', label: 'Paste Image Url' },
        { value: 'upload', label: 'UploadImage' },
      ],
    },
    {
      name: 'ImageUrl',
      label: 'Paste Image URL',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === 'Url',
      },
    },
    {
      name: 'ImageUpload',
      label: 'Upload Image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.ImageSource === 'upload',
      },
    },
    {
      name: 'isImportant',
      label: 'Choose If U Need The Image To Appear In Home Page',
      type: 'checkbox',
      defaultValue: false,
      validate: async (value, { req, operation, siblingData }) => {
        if (!value) return true

        const count = await req.payload.find({
          collection: 'Notes',
          where: { isImportant: { equals: true } },
          limit: 0,
        })

        const currentId = siblingData?.id
        const total = currentId && operation === 'update' ? count.totalDocs - 1 : count.totalDocs

        if (total >= 4) {
          return 'Cannot have more than 4 important products'
        }

        return true
      },
    },
  ],
}
