import { assertMutationRequest, assertRequestBodyLimit, backendRequest, noStore, requiredID } from '../../../../../utils/bff'
import { guestRequestBody, mapGuestRequest } from '../../../../../utils/guest-request'

export default defineEventHandler(async (event) => {
  noStore(event); assertMutationRequest(event); assertRequestBodyLimit(event)
  const id = requiredID(event)
  const body = guestRequestBody(await readBody(event))
  const source = await backendRequest<Record<string, unknown>>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/special-requests`, { method: 'POST', guestSession: true, body })
  return mapGuestRequest(source)
})
