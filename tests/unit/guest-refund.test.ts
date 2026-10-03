import { describe, expect, it } from 'vitest'
import { mapGuestRefundStatus } from '../../server/utils/guest-refund'

describe('guest refund mapper', () => {
  it('exposes only the guest-safe refund view and preserves unknown status', () => {
    const result = mapGuestRefundStatus({ booking_id: 'booking-1', has_refund: true, refunds: [{ id: 'refund-1', amount_minor: 125000, currency: 'IDR', reason: 'Pembatalan', status: 'provider_review', created_at: '2026-10-03T00:00:00Z', actor_id: 'staff:finance', provider_refund_id: 'secret-provider-ref' }] })
    expect(result.refunds[0]).toEqual({ id: 'refund-1', amount_minor: 125000, currency: 'IDR', reason: 'Pembatalan', status: 'provider_review', created_at: '2026-10-03T00:00:00Z', updated_at: undefined })
    expect(result.refunds[0]).not.toHaveProperty('actor_id')
    expect(result.refunds[0]).not.toHaveProperty('provider_refund_id')
  })

  it('rejects unsafe or negative upstream money', () => {
    expect(() => mapGuestRefundStatus({ booking_id: 'booking-1', has_refund: true, refunds: [{ amount_minor: -1 }] })).toThrow('Invalid refund amount')
  })
})
