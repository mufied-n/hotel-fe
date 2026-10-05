import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApiBookingClient } from '../../app/services/api-booking-client'

describe('api booking client simulatePay', () => {
  afterEach(() => vi.unstubAllGlobals())

  const tests = [
    { name: 'posts to the sandbox BFF endpoint with CSRF header', id: 'abc-123', fail: false, url: '/api/bff/bookings/abc-123/simulate-pay' },
    { name: 'encodes the booking id', id: 'a/b', fail: false, url: '/api/bff/bookings/a%2Fb/simulate-pay' },
    { name: 'wraps upstream failure as client error', id: 'abc-123', fail: true, url: '/api/bff/bookings/abc-123/simulate-pay' },
  ]

  for (const tt of tests) {
    it(tt.name, async () => {
      const fetchMock = vi.fn(async () => { if (tt.fail) throw { statusCode: 409, data: { code: 'HOLD_EXPIRED' } }; return { status: 'confirmed' } })
      vi.stubGlobal('$fetch', fetchMock)
      const promise = createApiBookingClient().simulatePay!(tt.id)
      if (tt.fail) await expect(promise).rejects.toBeDefined()
      else await expect(promise).resolves.toBeUndefined()
      expect(fetchMock).toHaveBeenCalledWith(tt.url, { method: 'POST', headers: { 'X-Pulang-CSRF': '1' } })
    })
  }
})
