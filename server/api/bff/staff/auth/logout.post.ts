import { noStore } from '../../../../utils/bff'
import { assertStaffMutation, staffRequest, staffSession } from '../../../../utils/staff-session'

export default defineEventHandler(async (event) => {
  noStore(event)
  assertStaffMutation(event, 0)
  const session = await staffSession(event)
  try { await staffRequest<unknown>(event, '/api/v1/auth/staff/logout', { method: 'POST' }) }
  finally { await session.clear() }
  setResponseStatus(event, 204)
})
