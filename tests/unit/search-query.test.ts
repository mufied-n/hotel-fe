import { describe, expect, it } from 'vitest'
import { decodeSearch, encodeSearch } from '../../app/utils/search-query'

describe('search query codec', () => {
  const input = { checkIn: '2026-10-03', checkOut: '2026-10-05', occupancy: [{ roomIndex: 0, adults: 2, childrenAges: [7] }, { roomIndex: 1, adults: 1, childrenAges: [] }], promoCode: 'OCTOBREAK', locale: 'id-ID' as const, currency: 'IDR' as const }
  it('round trips multi-room occupancy', () => {
    expect(decodeSearch(encodeSearch(input) as never)).toEqual(input)
  })
  it('rejects an unversioned query', () => {
    expect(decodeSearch({ check_in: '2026-10-03' })).toBeNull()
  })
})
