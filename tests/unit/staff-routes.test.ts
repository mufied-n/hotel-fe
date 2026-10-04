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

  it('maps known mutation routes', () => {
    expect(resolveStaffRoute('revenue/promos', 'POST')?.upstream).toBe('/api/v1/revenue/promos')
    expect(resolveStaffRoute('revenue/promos/PULANG10', 'PUT')?.upstream).toBe('/api/v1/revenue/promos/PULANG10')
    expect(resolveStaffRoute('finance/refunds', 'POST')?.upstream).toBe('/api/v1/finance/refunds')
    expect(resolveStaffRoute('housekeeping/rooms/301/status', 'PUT')?.upstream).toBe('/api/v1/housekeeping/rooms/301/status')
    expect(resolveStaffRoute('catalog/rooms', 'POST')?.upstream).toBe('/api/v1/catalog/rooms')
    expect(resolveStaffRoute('catalog/rooms/sup-king', 'PUT')?.upstream).toBe('/api/v1/catalog/rooms/sup-king')
    expect(resolveStaffRoute('catalog/rooms/sup-king', 'DELETE')?.upstream).toBe('/api/v1/catalog/rooms/sup-king')
    expect(resolveStaffRoute('catalog/rooms/../x', 'PUT')).toBeNull()
  })

  it('denies unsupported methods, traversal and unknown resources', () => {
    expect(resolveStaffRoute('finance/refunds', 'DELETE')).toBeNull()
    expect(resolveStaffRoute('housekeeping/rooms/301/status', 'DELETE')).toBeNull()
    expect(resolveStaffRoute('../auth/staff/me', 'GET')).toBeNull()
    expect(resolveStaffRoute('channels', 'GET')).toBeNull()
  })
})
