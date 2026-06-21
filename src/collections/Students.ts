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
// Reset-password link lifetime (configurable). Payload expects milliseconds.
const RESET_EXPIRATION_MS =
  Number(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || 60) * 60 * 1000

// Sensitive, server-managed fields: never expose over the API, hide in admin.
const internalField = {
  access: { read: () => false, update: () => false, create: () => false },
  admin: { hidden: true, readOnly: true },
} as const

export const Students: CollectionConfig = {
  slug: 'students',
  labels: { singular: 'Student', plural: 'Students' },
  auth: {
    forgotPassword: {
      expiration: RESET_EXPIRATION_MS,
    },
  },
  access: {
    // Signup happens server-side (with overrideAccess) so we control validation.
    create: () => false,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'twoFactorEnabled', 'createdAt'],
    group: 'Students',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      // Optional contact number.
    },
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When on, the student must enter an emailed code to log in.',
      },
    },
    // --- Server-managed email-OTP login challenge (never exposed) ---
    { name: 'twoFactorChallengeId', type: 'text', ...internalField },
    { name: 'twoFactorCodeHash', type: 'text', ...internalField },
    { name: 'twoFactorExpiresAt', type: 'date', ...internalField },
    { name: 'twoFactorPendingToken', type: 'text', ...internalField },
  ],
  timestamps: true,
}
