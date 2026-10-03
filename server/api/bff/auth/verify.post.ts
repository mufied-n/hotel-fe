import { assertMutationRequest, assertRequestBodyLimit, backendRequest, noStore, pulangSession } from '../../../utils/bff'

interface VerifyResponse { token: string, email: string, expires_at: string }

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  assertRequestBodyLimit(event, 2048)
  noStore(event)
  const body = await readBody<{ email?: string, code?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  const code = String(body.code || '').trim()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, statusMessage: 'Email atau kode verifikasi tidak valid.' })
  }
  const response = await backendRequest<VerifyResponse>(event, '/api/v1/auth/guest/verify', { method: 'POST', body: { email, code } })
  if (!response.token.startsWith('gst_sess_')) throw createError({ statusCode: 502, statusMessage: 'Respons sesi backend tidak valid.' })
  const session = await pulangSession(event)
  await session.update({ guestToken: response.token, guestEmail: response.email, guestExpiresAt: response.expires_at })
  return { email: response.email, expires_at: response.expires_at }
})
