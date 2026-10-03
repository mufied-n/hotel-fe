import { describe, expect, it } from 'vitest'
import { guestRequestBody, mapGuestRequestList } from '../../server/utils/guest-request'

describe('guest special request boundary', () => {
  it('normalizes a valid guest request body', () => {
    expect(guestRequestBody({ category: 'early_arrival', description: '  Tiba lebih awal  ', target_time: '11:30' })).toEqual({ category: 'early_arrival', description: 'Tiba lebih awal', target_time: '11:30' })
  })

  it('maps the guest response without unrelated backend fields', () => {
    const result = mapGuestRequestList({ booking_id: 'booking-1', requests: [{ id: 'request-1', booking_id: 'booking-1', category: 'quiet_room', department: 'front_desk', description: 'Kamar tenang', status: 'pending', created_at: '2026-10-03T00:00:00Z', updated_at: '2026-10-03T00:00:00Z', internal_actor: 'staff:1' }] })
    expect(result.requests[0]).not.toHaveProperty('internal_actor')
    expect(result.requests[0]?.description).toBe('Kamar tenang')
  })
})
