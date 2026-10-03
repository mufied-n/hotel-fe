import { backendRequest, noStore, requiredID } from '../../../../utils/bff'
import type { GuestAllowedActions, GuestBookingDetail } from '~~/shared/types/backend'

export default defineEventHandler((event) => {
  noStore(event)
  const id = requiredID(event)
  return backendRequest<{ booking: GuestBookingDetail, allowed_actions: GuestAllowedActions }>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}`, { guestSession: true })
})
