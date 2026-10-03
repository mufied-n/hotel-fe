import { assertMutationRequest, assertRequestBodyLimit, backendRequest, noStore } from '../../../utils/bff'

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  assertRequestBodyLimit(event, 2048)
  noStore(event)
  const body = await readBody<{ email?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Masukkan email yang valid.' })
  return backendRequest(event, '/api/v1/auth/guest/challenge', { method: 'POST', body: { email } })
})
