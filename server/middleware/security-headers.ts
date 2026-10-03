import { defineEventHandler, getRequestProtocol, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
  if (process.env.NODE_ENV === 'production' && getRequestProtocol(event) === 'https') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  }
  setResponseHeaders(event, headers)
})
