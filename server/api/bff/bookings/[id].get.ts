import { backendRequest, noStore, pulangSession, requiredID } from '../../../utils/bff'
import type { BackendBooking } from '~~/shared/types/backend'

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const session = await pulangSession(event)
  const access = session.data.bookingAccess?.[id]
  if (!access?.token) throw createError({ statusCode: 401, statusMessage: 'Akses booking tidak tersedia pada sesi ini.' })
  const booking = await backendRequest<BackendBooking>(event, `/api/v1/bookings/${encodeURIComponent(id)}`, { bookingToken: access.token })
  return {
    booking,
    payment_url: access.paymentUrl,
    reference: access.reference,
    expires_at: access.expiresAt || booking.expires_at,
    observed_at: new Date().toISOString(),
  }
})
