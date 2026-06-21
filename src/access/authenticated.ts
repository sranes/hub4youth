import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

// Admin-only: a logged-in *student* (a different auth collection) must never
// pass admin access checks, so we require the `users` (staff) collection here.
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return user?.collection === 'users'
}
