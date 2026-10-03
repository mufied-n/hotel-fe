import { backendRequest, noStore, requiredID } from '../../../../../utils/bff'
import { mapGuestRefundStatus } from '../../../../../utils/guest-refund'

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const source = await backendRequest<{ booking_id: string, has_refund: boolean, refunds?: Array<Record<string, unknown>> }>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/refund-status`, { guestSession: true })
  return mapGuestRefundStatus(source)
})
