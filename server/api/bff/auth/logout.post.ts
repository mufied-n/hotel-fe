import { assertMutationRequest, backendRequest, noStore, pulangSession } from '../../../utils/bff'

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  noStore(event)
  const session = await pulangSession(event)
  if (!session.data.guestToken) {
    await session.clear()
    return { status: 'ok' }
  }
  await backendRequest(event, '/api/v1/auth/guest/logout', { method: 'POST', guestSession: true })
  await session.clear()
  return { status: 'ok' }
})
