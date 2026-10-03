import { assertMutationRequest, assertRequestBodyLimit, backendRequest, noStore, pulangSession, validatedPaymentURL } from '../../../utils/bff'
import type { BackendCreateBookingResponse } from '~~/shared/types/backend'

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  assertRequestBodyLimit(event)
  noStore(event)
  const body = await readBody<Record<string, unknown>>(event)
  const key = String(getHeader(event, 'idempotency-key') || '')
  if (!/^[A-Za-z0-9._:-]{1,64}$/.test(key)) throw createError({ statusCode: 400, statusMessage: 'Idempotency-Key tidak valid.' })
  const validDate = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (typeof body.quote_id !== 'string' || body.quote_id.length > 80
    || body.terms_accepted !== true || body.privacy_accepted !== true
    || typeof body.room_type_id !== 'string' || body.room_type_id.length > 80
    || !validDate(body.check_in) || !validDate(body.check_out)
    || !Number.isInteger(body.num_rooms) || Number(body.num_rooms) < 1 || Number(body.num_rooms) > 8
    || !Number.isInteger(body.num_guests) || Number(body.num_guests) < 1
    || typeof body.guest_name !== 'string' || body.guest_name.trim().length < 2 || body.guest_name.length > 160
    || typeof body.guest_email !== 'string' || body.guest_email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.guest_email)
    || typeof body.guest_phone !== 'string' || body.guest_phone.length > 30
    || typeof body.estimated_arrival_time !== 'string' || (body.estimated_arrival_time !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.estimated_arrival_time))
    || typeof body.special_requests !== 'string' || [...body.special_requests].length > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Payload booking tidak lengkap atau tidak valid.' })
  }
  const response = await backendRequest<BackendCreateBookingResponse>(event, '/api/v1/bookings', { method: 'POST', body, idempotencyKey: key })
  if (!response.guest_access_token) throw createError({ statusCode: 502, statusMessage: 'Backend tidak mengembalikan akses booking.' })
  const session = await pulangSession(event)
  const paymentUrl = validatedPaymentURL(event, response.payment_url)
  await session.update({
    bookingAccess: {
      ...(session.data.bookingAccess || {}),
      [response.booking.id]: {
        token: response.guest_access_token || '',
        paymentUrl,
        reference: response.reference,
        expiresAt: response.expires_at,
      },
    },
  })
  return {
    booking: response.booking,
    payment_url: paymentUrl,
    reference: response.reference,
    expires_at: response.expires_at,
    server_time: response.server_time,
  }
})
