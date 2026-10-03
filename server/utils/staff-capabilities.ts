import type { H3Event } from 'h3'
import { assertMutationRequest, noStore } from './bff'

export function denyUnavailableStaffIntegration(event: H3Event) {
  noStore(event)
  if (event.method !== 'GET' && event.method !== 'HEAD') assertMutationRequest(event)
  throw createError({
    statusCode: 503,
    statusMessage: 'Integrasi staff belum tersedia sampai autentikasi staff tepercaya diaktifkan.',
    data: { code: 'CAPABILITY_DISABLED' },
  })
}
