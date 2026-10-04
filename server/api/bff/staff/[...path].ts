import { resolveStaffRoute } from '../../../utils/staff-capabilities'
import { assertStaffMutation, staffRequest } from '../../../utils/staff-session'

export default defineEventHandler(async (event) => {
  if (useRuntimeConfig(event).public.operationsMode !== 'api') throw createError({ statusCode: 503, statusMessage: 'Integrasi staff tidak aktif pada mode sample.', data: { code: 'CAPABILITY_DISABLED' } })
  const raw = getRouterParam(event, 'path') || ''
  const path = Array.isArray(raw) ? raw.join('/') : String(raw).replace(/^\/+/, '')
  const capability = resolveStaffRoute(path, event.method)
  if (!capability) throw createError({ statusCode: 503, statusMessage: 'Aksi staff ini masih dikunci sampai gate backend selesai.', data: { code: 'CAPABILITY_DISABLED' } })
  const query = Object.fromEntries(Object.entries(getQuery(event)).flatMap(([key, value]) => capability.queryKeys.includes(key) && typeof value === 'string' && /^[a-zA-Z0-9_.,:-]{0,100}$/.test(value) ? [[key, value]] : []))

  let body: unknown
  if (capability.mutation) {
    assertStaffMutation(event)
    body = await readBody(event)
  }

  return staffRequest(event, capability.upstream, {
    method: event.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    query,
    body,
  })
})
