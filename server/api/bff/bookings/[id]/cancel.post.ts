import { assertMutationRequest, backendRequest, noStore, pulangSession, requiredID } from '../../../../utils/bff'

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  noStore(event)
  const id = requiredID(event)
  const session = await pulangSession(event)
  const access = session.data.bookingAccess?.[id]
  if (!access?.token) throw createError({ statusCode: 401, statusMessage: 'Akses booking tidak tersedia pada sesi ini.' })
  const result = await backendRequest<{ status: string, id: string }>(event, `/api/v1/bookings/${encodeURIComponent(id)}/cancel`, { method: 'POST', bookingToken: access.token })
  await session.update({ bookingAccess: { ...(session.data.bookingAccess || {}), [id]: { ...access, paymentUrl: undefined } } })
  return result
})
