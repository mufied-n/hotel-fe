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

export interface StaffRouteCapability { upstream: string, mutation: boolean, queryKeys: string[] }

const readable: Array<{ pattern: RegExp, target: (match: RegExpMatchArray) => string, queryKeys: string[] }> = [
  { pattern: /^housekeeping\/rooms$/, target: () => '/api/v1/housekeeping/rooms', queryKeys: ['floor', 'status', 'room_type_id'] },
  { pattern: /^front-desk\/daily-roster$/, target: () => '/api/v1/front-desk/daily-roster', queryKeys: ['date'] },
  { pattern: /^front-desk\/handover-notes$/, target: () => '/api/v1/front-desk/handover-notes', queryKeys: ['limit', 'offset'] },
  { pattern: /^bookings\/([A-Za-z0-9-]{1,80})\/room-moves$/, target: match => `/api/v1/bookings/${match[1]}/room-moves`, queryKeys: [] },
  { pattern: /^finance\/reconciliations$/, target: () => '/api/v1/finance/reconciliations', queryKeys: [] },
  { pattern: /^finance\/cases$/, target: () => '/api/v1/finance/cases', queryKeys: ['status', 'limit'] },
  { pattern: /^catalog\/rooms$/, target: () => '/api/v1/catalog/rooms', queryKeys: [] },
  { pattern: /^catalog\/rooms\/([A-Za-z0-9-]{1,80})$/, target: match => `/api/v1/catalog/rooms/${match[1]}`, queryKeys: [] },
  { pattern: /^admin\/feature-flags$/, target: () => '/api/v1/admin/feature-flags', queryKeys: [] },
  { pattern: /^staff\/channel-sync-issues$/, target: () => '/api/v1/staff/channel-sync-issues', queryKeys: ['status', 'limit'] },
  { pattern: /^staff\/channel-partners\/([A-Za-z0-9_-]{1,80})$/, target: match => `/api/v1/staff/channel-partners/${match[1]}`, queryKeys: [] },
  { pattern: /^revenue\/promos$/, target: () => '/api/v1/revenue/promos', queryKeys: [] },
  { pattern: /^revenue\/calendar$/, target: () => '/api/v1/revenue/calendar', queryKeys: ['start_date', 'end_date', 'room_type_id'] },
  { pattern: /^front-desk\/special-requests$/, target: () => '/api/v1/front-desk/special-requests', queryKeys: ['status', 'limit'] },
  { pattern: /^front-desk\/verify-voucher$/, target: () => '/api/v1/front-desk/verify-voucher', queryKeys: ['code'] },
]

export function resolveStaffRoute(path: string, method: string): StaffRouteCapability | null {
  if (method !== 'GET' && method !== 'HEAD') return null
  for (const route of readable) {
    const match = path.match(route.pattern)
    if (match) return { upstream: route.target(match), mutation: false, queryKeys: route.queryKeys }
  }
  return null
}
