import { describe, expect, it } from 'vitest'
import { remainingHoldSeconds } from '../../app/composables/useHoldTimer'

describe('hold timer calculation', () => {
  it('uses the server snapshot and elapsed browser time', () => {
    expect(remainingHoldSeconds('2026-10-03T00:00:00Z', '2026-10-03T00:01:00Z', 10_500)).toBe(50)
  })

  it('never returns negative or NaN countdowns', () => {
    expect(remainingHoldSeconds('2026-10-03T00:02:00Z', '2026-10-03T00:01:00Z')).toBe(0)
    expect(remainingHoldSeconds('invalid', 'also-invalid')).toBe(0)
  })
})
