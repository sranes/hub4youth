import type { Access } from 'payload'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  // Only admin staff (the `users` collection) may read drafts. Students and the
  // public are limited to published documents.
  if (user?.collection === 'users') {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
