export const demoScenarios = ['available', 'sold-out', 'service-error', 'price-changed', 'pending_payment', 'processing', 'confirmed', 'failed', 'expired', 'needs_assistance', 'offline'] as const
export type DemoScenario = typeof demoScenarios[number]
