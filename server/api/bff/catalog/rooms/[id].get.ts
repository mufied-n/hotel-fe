import { backendRequest, noStore } from '../../../../utils/bff'
import type { BackendRoomVariant } from '~~/shared/types/backend'

export default defineEventHandler((event) => {
  noStore(event)
  const id = String(getRouterParam(event, 'id') || '')
  if (!/^[A-Za-z0-9-]{1,80}$/.test(id)) throw createError({ statusCode: 400, statusMessage: 'ID kamar tidak valid.' })
  return backendRequest<BackendRoomVariant>(event, `/api/v1/catalog/rooms/${encodeURIComponent(id)}`)
})
