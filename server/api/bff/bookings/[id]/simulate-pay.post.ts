import { assertMutationRequest, backendRequest, noStore, pulangSession, requiredID } from '../../../../utils/bff'

// Sandbox only: memanggil /fake-pay backend (hanya aktif non-production) agar booking PENDING -> CONFIRMED
// dan email voucher terkirim. Dimatikan kecuali NUXT_PUBLIC_SANDBOX_PAY=true.
export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  noStore(event)
  if (!useRuntimeConfig().public.sandboxPay) throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  const id = requiredID(event)
  const session = await pulangSession(event)
  if (!session.data.bookingAccess?.[id]?.token) throw createError({ statusCode: 401, statusMessage: 'Akses booking tidak tersedia pada sesi ini.' })
  const result = await backendRequest<{ status: string }>(event, `/fake-pay/${encodeURIComponent(id)}`, { method: 'POST', query: { booking_id: id } })
  const access = session.data.bookingAccess[id]
  await session.update({ bookingAccess: { ...session.data.bookingAccess, [id]: { ...access, paymentUrl: undefined } } })
  return result
})
