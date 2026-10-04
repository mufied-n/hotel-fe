import { describe, expect, it } from 'vitest'
import { sampleAudits, sampleChannels, sampleDeliveries, samplePromos } from '../../app/data/management-scenarios'

describe('management sample safety', () => {
  it('keeps recipients masked and retry eligibility explicit', () => {
    expect(sampleDeliveries.every(item => item.recipient.includes('*') || item.recipient.includes('•'))).toBe(true)
    expect(sampleDeliveries.some(item => item.retryEligible)).toBe(true)
    expect(sampleChannels.filter(item => item.retryEligible).every(item => item.status !== 'healthy')).toBe(true)
  })

  it('contains structured before and after audit data without free text', () => {
    expect(sampleAudits.every(item => item.resourceType && item.target)).toBe(true)
    expect(JSON.stringify(sampleAudits)).not.toMatch(/password|credential|otp/i)
  })

  it('contains valid promo sample definitions with standard date ranges and discount types', () => {
    expect(samplePromos.length).toBeGreaterThan(0)
    for (const promo of samplePromos) {
      expect(promo.code).toMatch(/^[A-Z0-9_-]+$/)
      expect(['percent', 'fixed']).toContain(promo.type)
      expect(['active', 'scheduled', 'expired']).toContain(promo.status)
      expect(promo.value).toBeGreaterThan(0)
      expect(promo.startsAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(promo.endsAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(promo.startsAt <= promo.endsAt).toBe(true)
    }
  })
})
