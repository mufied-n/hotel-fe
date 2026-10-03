import type { BackendProblem } from '~~/shared/types/backend'

type NitroEvent = Parameters<typeof getHeader>[0]

interface BookingAccess { token: string, paymentUrl?: string, reference?: string, expiresAt?: string }
export interface PulangSessionData {
  guestToken?: string
  guestEmail?: string
  guestExpiresAt?: string
  bookingAccess?: Record<string, BookingAccess>
}

function privateConfig(event: NitroEvent) {
  void event
  return useRuntimeConfig()
}

function sessionConfig(event: NitroEvent) {
  const config = privateConfig(event)
  if (typeof config.sessionPassword !== 'string' || config.sessionPassword.length < 32) {
    throw createError({ statusCode: 503, statusMessage: 'Private session is not configured' })
  }
  return {
    name: 'pulang_bff',
    password: config.sessionPassword,
    maxAge: 7 * 24 * 60 * 60,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' },
    sessionHeader: false as const,
  }
}

export function pulangSession(event: NitroEvent) {
  return useSession<PulangSessionData>(event, sessionConfig(event))
}

export function noStore(event: NitroEvent) {
  setResponseHeader(event, 'Cache-Control', 'no-store, private')
}

export function assertMutationRequest(event: NitroEvent) {
  if (getHeader(event, 'x-pulang-csrf') !== '1') {
    throw createError({ statusCode: 403, statusMessage: 'Request origin could not be verified' })
  }
  const origin = getHeader(event, 'origin')
  const host = getHeader(event, 'host')
  if (origin && host) {
    let originHost: string
    try { originHost = new URL(origin).host }
    catch { throw createError({ statusCode: 403, statusMessage: 'Invalid request origin' }) }
    if (originHost !== host) throw createError({ statusCode: 403, statusMessage: 'Cross-origin mutation is not allowed' })
  }
}

export function assertRequestBodyLimit(event: NitroEvent, maxBytes = 16_384) {
  const length = Number(getHeader(event, 'content-length') || 0)
  if (!Number.isFinite(length) || length < 0 || length > maxBytes) {
    throw createError({ statusCode: 413, statusMessage: 'Request body terlalu besar.' })
  }
}

function safeBackendURL(event: NitroEvent, path: string, query?: Record<string, string | number | undefined>) {
  const base = String(privateConfig(event).backendBaseUrl || '')
  let url: URL
  try { url = new URL(path, base.endsWith('/') ? base : `${base}/`) }
  catch { throw createError({ statusCode: 503, statusMessage: 'Backend URL is not configured' }) }
  const baseURL = new URL(base)
  if (url.origin !== baseURL.origin) throw createError({ statusCode: 500, statusMessage: 'Unsafe upstream URL' })
  for (const [key, value] of Object.entries(query || {})) if (value !== undefined) url.searchParams.set(key, String(value))
  return url
}

function problemMessage(problem: BackendProblem | null, status: number) {
  return problem?.detail || problem?.message || problem?.title || (status >= 500 ? 'Layanan booking sedang tidak tersedia.' : 'Permintaan tidak dapat diproses.')
}

export async function backendRequest<T>(event: NitroEvent, path: string, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: Record<string, string | number | undefined>
  body?: unknown
  guestSession?: boolean
  bookingToken?: string
  idempotencyKey?: string
  raw?: boolean
} = {}): Promise<T> {
  const headers = new Headers({ Accept: options.raw ? '*/*' : 'application/json' })
  let body: string | undefined
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }
  if (options.guestSession) {
    const session = await pulangSession(event)
    if (!session.data.guestToken) throw createError({ statusCode: 401, statusMessage: 'Silakan masuk terlebih dahulu.' })
    headers.set('X-Guest-Session', session.data.guestToken)
  }
  if (options.bookingToken) headers.set('X-Guest-Token', options.bookingToken)
  if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey)

  let response: Response
  try {
    response = await fetch(safeBackendURL(event, path, options.query), { method: options.method || 'GET', headers, body, signal: AbortSignal.timeout(12_000) })
  }
  catch {
    throw createError({ statusCode: 503, statusMessage: 'Backend booking belum dapat dijangkau.' })
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as BackendProblem | null
    throw createError({
      statusCode: response.status,
      statusMessage: problemMessage(problem, response.status),
      data: { code: problem?.code || problem?.error || 'UPSTREAM_ERROR' },
    })
  }
  if (options.raw) return response as T
  return await response.json() as T
}

export function requiredID(event: NitroEvent) {
  const id = String(getRouterParam(event, 'id') || '')
  if (!/^[A-Za-z0-9-]{1,80}$/.test(id)) throw createError({ statusCode: 400, statusMessage: 'ID booking tidak valid.' })
  return id
}

export function validatedPaymentURL(event: NitroEvent, value?: string) {
  if (!value) return undefined
  let url: URL
  try { url = new URL(value) }
  catch { return undefined }
  const allowed = String(privateConfig(event).paymentOrigins || '').split(',').map(item => item.trim()).filter(Boolean)
  if (!allowed.includes(url.origin)) return undefined
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') return undefined
  return url.toString()
}
