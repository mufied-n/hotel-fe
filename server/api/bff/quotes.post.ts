import { assertMutationRequest, assertRequestBodyLimit, backendRequest } from '../../utils/bff'
import type { BackendLockedQuote } from '~~/shared/types/backend'

export default defineEventHandler(async (event) => {
  assertMutationRequest(event)
  assertRequestBodyLimit(event)
  const body = await readBody<Record<string, unknown>>(event)
  const validDate = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (typeof body.room_type_id !== 'string' || body.room_type_id.length > 80
    || !['room_only', 'bed_and_breakfast'].includes(String(body.rate_plan_code))
    || !validDate(body.check_in) || !validDate(body.check_out)
    || !Number.isInteger(body.num_rooms) || Number(body.num_rooms) < 1 || Number(body.num_rooms) > 8
    || !Number.isInteger(body.num_guests) || Number(body.num_guests) < 1
    || typeof body.promo_code !== 'string' || body.promo_code.length > 30) {
    throw createError({ statusCode: 400, statusMessage: 'Payload quote tidak valid.' })
  }
  return backendRequest<BackendLockedQuote>(event, '/api/v1/quotes', { method: 'POST', body })
})
