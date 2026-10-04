import { describe, expect, it } from 'vitest'
import { resolveStaffRoute } from '../../server/utils/staff-capabilities'

describe('staff BFF allowlist', () => {
  it('maps only known read routes', () => {
    expect(resolveStaffRoute('front-desk/daily-roster', 'GET')?.upstream).toBe('/api/v1/front-desk/daily-roster')
    expect(resolveStaffRoute('front-desk/daily-roster', 'GET')?.queryKeys).toEqual(['date'])
    expect(resolveStaffRoute('bookings/demo-001/room-moves', 'GET')?.upstream).toBe('/api/v1/bookings/demo-001/room-moves')
    expect(resolveStaffRoute('admin/feature-flags', 'GET')?.upstream).toBe('/api/v1/admin/feature-flags')
    expect(resolveStaffRoute('staff/channel-sync-issues', 'GET')?.upstream).toBe('/api/v1/staff/channel-sync-issues')
    expect(resolveStaffRoute('revenue/promos', 'GET')?.upstream).toBe('/api/v1/revenue/promos')
  })

  it('denies mutations, traversal and unknown resources', () => {
    expect(resolveStaffRoute('finance/refunds', 'POST')).toBeNull()
    expect(resolveStaffRoute('housekeeping/rooms/301/status', 'PUT')).toBeNull()
    expect(resolveStaffRoute('../auth/staff/me', 'GET')).toBeNull()
    expect(resolveStaffRoute('channels', 'GET')).toBeNull()
  })
})
