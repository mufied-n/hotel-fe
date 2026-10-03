import { backendRequest, noStore, requiredID } from '../../../../../utils/bff'
import { mapGuestRequestList } from '../../../../../utils/guest-request'

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const source = await backendRequest<{ booking_id: unknown, requests?: Array<Record<string, unknown>> }>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/special-requests`, { guestSession: true })
  return mapGuestRequestList(source)
})
