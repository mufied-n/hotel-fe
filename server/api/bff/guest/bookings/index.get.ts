import { backendRequest, noStore } from '../../../../utils/bff'
import type { GuestBookingSummary } from '~~/shared/types/backend'

export default defineEventHandler((event) => {
  noStore(event)
  const query = getQuery(event)
  const status = typeof query.status === 'string' && ['all', 'upcoming', 'completed', 'cancelled'].includes(query.status) ? query.status : 'all'
  return backendRequest<{ data: GuestBookingSummary[], total: number }>(event, '/api/v1/guest/bookings', { guestSession: true, query: { status, limit: 20 } })
})
