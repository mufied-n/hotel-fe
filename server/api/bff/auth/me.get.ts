import { backendRequest, noStore } from '../../../utils/bff'
import type { GuestProfile } from '~~/shared/types/backend'

export default defineEventHandler((event) => {
  noStore(event)
  return backendRequest<GuestProfile>(event, '/api/v1/auth/guest/me', { guestSession: true })
})
