import type { AuditSnapshot, ChannelSnapshot, DeliverySnapshot, PromoSnapshot } from '~/types/management'

export const sampleChannels: ChannelSnapshot[] = [
  { id: 'direct', name: 'Direct booking', status: 'healthy', lastSyncAt: '2026-10-03T03:12:00Z', pendingUpdates: 0, message: 'Inventory sample sinkron.' },
  { id: 'ota-a', name: 'OTA Alpha', status: 'delayed', lastSyncAt: '2026-10-03T02:47:00Z', pendingUpdates: 3, message: 'Tiga pembaruan tarif menunggu acknowledgment.' },
  { id: 'ota-b', name: 'OTA Beta', status: 'attention', lastSyncAt: '2026-10-02T22:10:00Z', pendingUpdates: 7, message: 'Credential sample perlu diperiksa.' },
]

export const sampleDeliveries: DeliverySnapshot[] = [
  { id: 'delivery-001', channel: 'email', recipient: 'ta***@example.com', template: 'booking-confirmed', status: 'delivered', attempts: 1, updatedAt: '2026-10-03T03:01:00Z' },
  { id: 'delivery-002', channel: 'whatsapp', recipient: '+62 812••••1234', template: 'arrival-reminder', status: 'retrying', attempts: 2, updatedAt: '2026-10-03T02:58:00Z' },
  { id: 'delivery-003', channel: 'email', recipient: 'gu***@example.com', template: 'payment-recovery', status: 'failed', attempts: 3, updatedAt: '2026-10-03T02:25:00Z' },
]

export const sampleAudits: AuditSnapshot[] = [
  { id: 'audit-001', actor: 'staff:receptionist_sample', role: 'receptionist', action: 'room.move.preview', target: 'demo-stay-001', occurredAt: '2026-10-03T02:15:00Z', result: 'success' },
  { id: 'audit-002', actor: 'staff:housekeeping_sample', role: 'housekeeping', action: 'finance.refund', target: 'demo-booking-002', occurredAt: '2026-10-03T01:41:00Z', result: 'denied' },
  { id: 'audit-003', actor: 'staff:gm_sample', role: 'gm_admin', action: 'policy.update.preview', target: 'hotel-policy', occurredAt: '2026-10-02T23:05:00Z', result: 'success' },
]

export const samplePromos: PromoSnapshot[] = [
  { code: 'PULANG10', type: 'percent', value: 10, status: 'active', startsAt: '2026-10-01', endsAt: '2026-10-31' },
  { code: 'WEEKDAY150', type: 'fixed', value: 150000, status: 'scheduled', startsAt: '2026-11-01', endsAt: '2026-11-30' },
  { code: 'LIBURAN', type: 'percent', value: 15, status: 'expired', startsAt: '2026-08-01', endsAt: '2026-08-31' },
]
