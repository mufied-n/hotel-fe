import { describe, expect, it } from 'vitest'
import { roleCan } from '../../app/composables/useStaffPreview'

describe('staff preview permissions', () => {
  it('limits operational roles to their sample workspace', () => {
    expect(roleCan('receptionist', 'front_desk')).toBe(true)
    expect(roleCan('receptionist', 'finance')).toBe(false)
    expect(roleCan('housekeeping', 'housekeeping')).toBe(true)
  })

  it('lets the GM preview all management areas', () => {
    expect(roleCan('gm_admin', 'configuration')).toBe(true)
    expect(roleCan('gm_admin', 'channels')).toBe(true)
  })

  it('keeps revenue and finance capabilities separated', () => {
    expect(roleCan('revenue_mgr', 'revenue')).toBe(true)
    expect(roleCan('revenue_mgr', 'finance')).toBe(false)
    expect(roleCan('finance', 'revenue')).toBe(false)
  })
})
