import type { Access, CollectionConfig } from 'payload'

// Admin staff (the `users` collection) can manage everyone; a student can only
// read/update their own record. Used for read/update below.
const selfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  return { id: { equals: user.id } }
}

const adminOnly: Access = ({ req: { user } }) => user?.collection === 'users'

/**
 * Student accounts for the on-site, self-paced learning experience. This is a
 * SEPARATE auth collection from `users` (admin staff) — students authenticate
 * on the public site and can never reach the admin panel (`admin.user` is
 * `users`). Records are created server-side during signup/enrollment.
 */
export const Students: CollectionConfig = {
  slug: 'students',
  labels: { singular: 'Student', plural: 'Students' },
  auth: true,
  access: {
    // Signup happens server-side (with overrideAccess) so we control validation.
    create: () => false,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: 'Students',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
