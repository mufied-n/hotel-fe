import { describe, expect, it } from 'vitest'
import { createMockBookingClient } from '../../app/services/mock-booking-client'
import type { BookingDraft, SearchInput } from '../../app/types/booking'

const search: SearchInput = { checkIn: '2026-10-03', checkOut: '2026-10-04', occupancy: [{ roomIndex: 0, adults: 1, childrenAges: [] }, { roomIndex: 1, adults: 2, childrenAges: [7] }], locale: 'id-ID', currency: 'IDR' }

describe('mock booking client', () => {
  it('returns a consistent aggregate multi-room quote', async () => {
    const client = createMockBookingClient()
    const quote = await client.quote(search, { variantIds: ['deluxe-king-bay', 'family-suite'], ratePlanIds: ['room_only', 'bed_and_breakfast'] })
    expect(quote.items).toHaveLength(2)
    expect(quote.total.amount).toBe(quote.items.reduce((sum, item) => sum + item.total.amount, 0))
    expect(quote.subtotal.amount + quote.taxes.amount + quote.service.amount).toBe(quote.total.amount)
  })

  it('preserves the observed included-charge snapshot exactly', async () => {
    const client = createMockBookingClient()
    const quote = await client.quote({ ...search, occupancy: [search.occupancy[0]!] }, { variantIds: ['deluxe-king-bay'], ratePlanIds: ['room_only'] })
    expect(quote.taxes.amount).toBe(10193694)
    expect(quote.service.amount).toBe(10286364)
    expect(quote.subtotal.amount + quote.taxes.amount + quote.service.amount).toBe(quote.total.amount)
  })

  it('changes the authoritative demo quote for a valid promo and rejects invalid or expired codes', async () => {
    const client = createMockBookingClient()
    const selection = { variantIds: ['deluxe-king-bay'], ratePlanIds: ['room_only'] }
    const baseline = await client.quote({ ...search, occupancy: [search.occupancy[0]!] }, selection)
    const promo = await client.quote({ ...search, occupancy: [search.occupancy[0]!], promoCode: 'OCTOBREAK' }, selection)
    expect(promo.total.amount).toBeLessThan(baseline.total.amount)
    expect(promo.version).toBe(2)
    await expect(client.quote({ ...search, occupancy: [search.occupancy[0]!], promoCode: 'NOPE' }, selection)).rejects.toThrow('tidak valid')
    await expect(client.quote({ ...search, occupancy: [search.occupancy[0]!], promoCode: 'EXPIRED' }, selection)).rejects.toThrow('kedaluwarsa')
  })

  it('replays the same submit attempt for an idempotency key', async () => {
    const client = createMockBookingClient()
    const quote = await client.quote({ ...search, occupancy: [search.occupancy[0]!] }, { variantIds: ['deluxe-king-bay'], ratePlanIds: ['room_only'] })
    const draft: BookingDraft = { search: quote.search, selectedQuote: quote, guest: { fullName: 'Tamu Demo', email: 'demo@example.test', specialRequests: '' }, consent: true, idempotencyKey: 'attempt-test' }
    const first = await client.createBooking(draft, 'attempt-test')
    const replay = await client.createBooking(draft, 'attempt-test')
    expect(replay.id).toBe(first.id)
  })
})
