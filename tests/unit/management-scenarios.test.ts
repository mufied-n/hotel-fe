import { describe, expect, it } from 'vitest'
import { sampleAudits, sampleChannels, sampleDeliveries } from '../../app/data/management-scenarios'

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
})
