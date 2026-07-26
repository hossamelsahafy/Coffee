import type { CollectionConfig } from 'payload'

export const Subscripe: CollectionConfig = {
  slug: 'Subscripe',
  access: { read: () => true, create: () => true },
  fields: [{ name: 'Email', required: true, unique: true, type: 'email' }],
}
