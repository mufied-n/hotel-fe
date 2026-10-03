import { noStore } from '../../../../utils/bff'
import { staffRequest, staffSession } from '../../../../utils/staff-session'
import type { BackendStaffPrincipal } from '~~/shared/types/backend'

export default defineEventHandler(async (event) => {
  noStore(event)
  const session = await staffSession(event)
  const principal = await staffRequest<BackendStaffPrincipal>(event, '/api/v1/auth/staff/me')
  await session.update({ token: session.data.token, expiresAt: session.data.expiresAt, principal: { ...session.data.principal, ...principal } })
  return { staff: { ...session.data.principal, ...principal }, expiresAt: session.data.expiresAt }
})
