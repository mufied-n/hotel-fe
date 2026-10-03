import { backendRequest } from '../../utils/bff'
import type { BackendSearchResponse } from '~~/shared/types/backend'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const allowed = ['check_in', 'check_out', 'rooms', 'adults', 'children', 'child_ages'] as const
  const upstream: Record<string, string> = {}
  for (const key of allowed) if (typeof query[key] === 'string') upstream[key] = query[key]
  return backendRequest<BackendSearchResponse>(event, '/api/v1/search', { query: upstream })
})
