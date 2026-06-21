import type { Access, CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

// Admin staff see all enrollments; a logged-in student may read only their own.
const readOwnOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  return { student: { equals: user.id } }
}

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  labels: {
    singular: 'Enrollment',
    plural: 'Enrollments',
  },
  access: {
    // Records are created/updated only server-side (checkout action + webhooks) with overrideAccess.
    create: () => false,
    read: readOwnOrAdmin,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['courseTitle', 'name', 'email', 'amount', 'status', 'createdAt'],
    useAsTitle: 'courseTitle',
    group: 'Leads',
  },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      admin: { position: 'sidebar' },
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      admin: {
        position: 'sidebar',
        description: 'Linked learner account for on-site, self-paced access.',
      },
    },
    {
      name: 'completedLessons',
      type: 'json',
      defaultValue: [],
      admin: {
        readOnly: true,
        description: 'Array of completed lesson ids (learner progress).',
      },
    },
    {
      name: 'quizResults',
      type: 'json',
      defaultValue: {},
      admin: {
        readOnly: true,
        description: 'Quiz/assessment results keyed by quiz id ({ score, total, passed }).',
      },
    },
    {
      name: 'courseTitle',
      type: 'text',
      admin: {
        description: 'Snapshot of the course title at the time of enrollment.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Charged amount in the major currency unit (e.g. rupees, not paise).',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Stripe', value: 'stripe' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'providerOrderId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe Checkout Session id or Razorpay order id.',
      },
    },
    {
      name: 'providerPaymentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Payment id confirmed by the provider webhook.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
