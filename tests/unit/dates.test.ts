import { describe, expect, it } from 'vitest'
import { nightsBetween, parseDateOnly } from '../../app/utils/dates'

describe('date-only contract', () => {
  it.each([
    ['2026-10-03', '2026-10-04', 1],
    ['2026-10-31', '2026-11-02', 2],
    ['2028-02-28', '2028-03-01', 2],
  ])('counts checkout-exclusive nights', (checkIn, checkOut, nights) => {
    expect(nightsBetween(checkIn, checkOut)).toBe(nights)
  })

  it('rejects impossible calendar dates', () => {
    expect(parseDateOnly('2026-02-30')).toBeNull()
    expect(parseDateOnly('03-10-2026')).toBeNull()
  })
})
