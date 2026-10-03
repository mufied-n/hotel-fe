import type { H3Event } from 'h3'
import type { BackendProblem, BackendStaffLoginResponse, BackendStaffPrincipal } from '~~/shared/types/backend'
import { assertMutationRequest, assertRequestBodyLimit, noStore } from './bff'

interface StaffSessionData {
  token?: string
  expiresAt?: string
  principal?: BackendStaffPrincipal
}

function config(event: H3Event) {
  const runtime = useRuntimeConfig(event)
  if (typeof runtime.sessionPassword !== 'string' || runtime.sessionPassword.length < 32) throw createError({ statusCode: 503, statusMessage: 'Private session is not configured' })
  return {
    name: 'pulang_staff_bff',
    password: runtime.sessionPassword,
    maxAge: 8 * 60 * 60,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' },
    sessionHeader: false as const,
  }
}

export function staffSession(event: H3Event) { return useSession<StaffSessionData>(event, config(event)) }

function upstreamURL(event: H3Event, path: string, query?: Record<string, string | number | undefined>) {
  const base = String(useRuntimeConfig(event).backendBaseUrl || '')
  let baseURL: URL
  let url: URL
  try {
    baseURL = new URL(base)
    url = new URL(path.replace(/^\/+/, ''), base.endsWith('/') ? base : `${base}/`)
  }
  catch { throw createError({ statusCode: 503, statusMessage: 'Backend URL is not configured' }) }
  if (url.origin !== baseURL.origin) throw createError({ statusCode: 500, statusMessage: 'Unsafe upstream URL' })
  for (const [key, value] of Object.entries(query || {})) if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  return url
}

function message(problem: BackendProblem | null, status: number) { return problem?.detail || problem?.message || problem?.title || (status >= 500 ? 'Layanan staff sedang tidak tersedia.' : 'Permintaan staff tidak dapat diproses.') }

async function parseUpstream<T>(event: H3Event, response: Response): Promise<T> {
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as BackendProblem | null
    const retryAfter = response.headers.get('Retry-After')
    if (retryAfter && /^\d+$/.test(retryAfter)) setResponseHeader(event, 'Retry-After', Number(retryAfter))
    throw createError({ statusCode: response.status, statusMessage: message(problem, response.status), data: { code: problem?.code || problem?.error || 'UPSTREAM_ERROR' } })
  }
  if (response.status === 204) return undefined as T
  return await response.json() as T
}

export async function staffLogin(event: H3Event, username: string, password: string) {
  const response = await fetch(upstreamURL(event, '/api/v1/auth/staff/login'), { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), signal: AbortSignal.timeout(12_000) }).catch(() => { throw createError({ statusCode: 503, statusMessage: 'Backend staff belum dapat dijangkau.' }) })
  return parseUpstream<BackendStaffLoginResponse>(event, response)
}

export async function staffRequest<T>(event: H3Event, path: string, options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE', query?: Record<string, string | number | undefined>, body?: unknown } = {}) {
  noStore(event)
  const session = await staffSession(event)
  if (!session.data.token || !session.data.expiresAt || Date.parse(session.data.expiresAt) <= Date.now()) {
    await session.clear()
    throw createError({ statusCode: 401, statusMessage: 'Sesi staff telah berakhir.', data: { code: 'AUTHENTICATION_REQUIRED' } })
  }
  const headers = new Headers({ Accept: 'application/json', Authorization: `Bearer ${session.data.token}` })
  let body: string | undefined
  if (options.body !== undefined) { headers.set('Content-Type', 'application/json'); body = JSON.stringify(options.body) }
  const response = await fetch(upstreamURL(event, path, options.query), { method: options.method || 'GET', headers, body, signal: AbortSignal.timeout(12_000) }).catch(() => { throw createError({ statusCode: 503, statusMessage: 'Backend staff belum dapat dijangkau.' }) })
  if (response.status === 401) await session.clear()
  return parseUpstream<T>(event, response)
}

export function assertStaffMutation(event: H3Event, maxBytes = 16_384) {
  assertMutationRequest(event)
  assertRequestBodyLimit(event, maxBytes)
}
