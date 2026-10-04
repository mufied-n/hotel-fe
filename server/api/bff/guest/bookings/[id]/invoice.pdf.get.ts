import { backendRequest, noStore, requiredID } from '../../../../../utils/bff'

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const response = await backendRequest<Response>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/invoice.pdf`, { guestSession: true, raw: true })
  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="invoice-${id}.pdf"`)
  return new Uint8Array(await response.arrayBuffer())
})
