import { backendRequest, noStore, requiredID } from '../../../../../utils/bff'

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const response = await backendRequest<Response>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/calendar.ics`, { guestSession: true, raw: true })
  setResponseHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="pulang-booking-${id}.ics"`)
  return new Uint8Array(await response.arrayBuffer())
})
