import { backendRequest, noStore } from '../../utils/bff'
import type { BackendAvailabilityResponse } from '~~/shared/types/backend'

export default defineEventHandler((event) => {
  noStore(event)
  const query = getQuery(event)
  const roomTypeId = String(query.room_type_id || '')
  const checkIn = String(query.check_in || '')
  const checkOut = String(query.check_out || '')
  if (!/^[A-Za-z0-9-]{1,80}$/.test(roomTypeId) || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || checkIn >= checkOut) throw createError({ statusCode: 400, statusMessage: 'Parameter availability tidak valid.' })
  return backendRequest<BackendAvailabilityResponse>(event, '/api/v1/availability', { query: { room_type_id: roomTypeId, check_in: checkIn, check_out: checkOut } })
})
