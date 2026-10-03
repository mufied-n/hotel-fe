import { describe, expect, it } from 'vitest'
import { decodeStaffFilterQuery, encodeStaffFilterQuery, type StaffFilterSchema } from '../../app/utils/staff-filter-query'

const schema = {
  floor: { type: 'integer', default: 0, min: 0, max: 99 },
  status: { type: 'enum', default: '', values: ['open', 'closed'] },
  date: { type: 'date', default: '2026-10-04' },
  room_type: { type: 'string', default: '', maxLength: 12 },
} satisfies StaffFilterSchema

describe('staff filter query codec', () => {
  it('round trips allowlisted non-default filters', () => {
    const values = { floor: 3, status: 'open', date: '2026-10-05', room_type: 'deluxe-king' }
    expect(decodeStaffFilterQuery(schema, encodeStaffFilterQuery(schema, values))).toEqual(values)
  })

  it('normalizes invalid and repeated values to safe defaults', () => {
    expect(decodeStaffFilterQuery(schema, { floor: '-2', status: ['unknown', 'open'], date: 'tomorrow', room_type: 'abcdefghijklmnop' })).toEqual({
      floor: 0,
      status: '',
      date: '2026-10-04',
      room_type: 'abcdefghijkl',
    })
  })

  it('emits schema keys only and omits defaults', () => {
    expect(encodeStaffFilterQuery(schema, { floor: 0, status: '', date: '2026-10-04', room_type: '', email: 'guest@example.com' })).toEqual({})
  })
})
