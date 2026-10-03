import { assertStaffMutation, staffLogin, staffSession } from '../../../../utils/staff-session'
import { noStore } from '../../../../utils/bff'

export default defineEventHandler(async (event) => {
  noStore(event)
  assertStaffMutation(event, 4_096)
  const raw = await readRawBody(event, 'utf8')
  if (!raw || new TextEncoder().encode(raw).byteLength > 4_096) throw createError({ statusCode: raw ? 413 : 400, statusMessage: raw ? 'Request body terlalu besar.' : 'Request body wajib diisi.' })
  let body: { username?: string, password?: string }
  try { body = JSON.parse(raw) as { username?: string, password?: string } }
  catch { throw createError({ statusCode: 400, statusMessage: 'Format JSON tidak valid.', data: { code: 'INVALID_REQUEST' } }) }
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')
  if (!username || !password) throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi.', data: { code: 'INVALID_REQUEST' } })
  const result = await staffLogin(event, username, password)
  if (!result.token.startsWith('stf_') || !Number.isFinite(Date.parse(result.expires_at)) || Date.parse(result.expires_at) <= Date.now()) throw createError({ statusCode: 502, statusMessage: 'Respons sesi staff tidak valid.', data: { code: 'INVALID_AUTH_RESPONSE' } })
  const session = await staffSession(event)
  await session.update({ token: result.token, expiresAt: result.expires_at, principal: result.staff })
  return { staff: result.staff, expiresAt: result.expires_at }
})
