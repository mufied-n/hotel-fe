import { backendRequest, noStore, requiredID } from '../../../../../utils/bff'

export default defineEventHandler((event) => {
  noStore(event)
  const id = requiredID(event)
  return backendRequest(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/refund-status`, { guestSession: true })
})
