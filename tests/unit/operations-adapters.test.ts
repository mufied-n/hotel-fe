import { describe, expect, it } from 'vitest'
import { toDailyRoster, toFinanceCases, toHandovers, toRefund, toRoomBoard } from '../../app/utils/operations-adapters'

describe('staff backend adapters', () => {
  it('maps snake_case room and roster payloads without inventing missing arrays', () => {
    const board = toRoomBoard({ total_rooms: 1, summary: { vacant_dirty: 1, cleaning: 0, vacant_clean: 0, inspected: 0, occupied: 0, out_of_service: 0, out_of_order: 0 }, rooms: [{ room_number: '301', room_type_id: 'sup', room_type_name: 'Superior', floor: 3, cleanliness_status: 'vacant_dirty', maintenance_notes: '', updated_at: '2026-10-03T00:00:00Z', updated_by: 'staff:hk' }] })
    expect(board.rooms[0]).toMatchObject({ roomNumber: '301', roomTypeId: 'sup', status: 'vacant_dirty' })
    const roster = toDailyRoster({ date: '2026-10-03', metrics: { total_rooms: 95, sellable_rooms: 94, out_of_order_rooms: 1, occupied_rooms: 70, vacant_inspected_rooms: 10, vacant_dirty_rooms: 8, cleaning_rooms: 6, occupancy_rate_percent: 73.7 }, expected_arrivals: null, expected_departures: null, in_house_count: 70 })
    expect(roster.expectedArrivals).toEqual([])
    expect(roster.metrics.vacantInspectedRooms).toBe(10)
  })

  it('unwraps response envelopes used by handover, finance cases and refund', () => {
    expect(toHandovers({ total: 0, notes: null })).toEqual({ total: 0, notes: [] })
    expect(toFinanceCases({ total: 0, cases: null })).toEqual({ total: 0, cases: [] })
    expect(toRefund({ status: 'success', refund: { id: 'r1', booking_id: 'b1', reference_id: 'rfnd-1', amount_minor: 1000, currency: 'IDR', reason: 'Duplicate', status: 'pending', created_at: '2026-10-03T00:00:00Z' } })).toMatchObject({ bookingId: 'b1', referenceId: 'rfnd-1', status: 'pending' })
  })
})
