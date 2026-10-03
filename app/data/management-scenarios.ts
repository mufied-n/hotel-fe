import type { AuditSnapshot, ChannelSnapshot, DeliverySnapshot, PromoSnapshot } from '~/types/management'

export const sampleChannels: ChannelSnapshot[] = [
  { id: 'direct', name: 'Direct booking', status: 'healthy', lastSyncAt: '2026-10-03T03:12:00Z', pendingUpdates: 0, message: 'Inventory sample sinkron.', operation: 'inventory.push', resource: 'all-room-types', version: 'sample-v18', attempts: 1, lastEvent: 'Acknowledged', retryEligible: false },
  { id: 'ota-a', name: 'OTA Alpha', status: 'delayed', lastSyncAt: '2026-10-03T02:47:00Z', pendingUpdates: 3, message: 'Tiga pembaruan tarif menunggu acknowledgment.', operation: 'rate.push', resource: 'deluxe-king:2026-10', version: 'sample-v12', attempts: 2, lastEvent: 'Awaiting acknowledgment', sanitizedError: 'Provider response melewati batas waktu.', retryEligible: true },
  { id: 'ota-b', name: 'OTA Beta', status: 'attention', lastSyncAt: '2026-10-02T22:10:00Z', pendingUpdates: 7, message: 'Credential sample perlu diperiksa.', operation: 'availability.push', resource: 'superior-twin:2026-10', version: 'sample-v7', attempts: 3, lastEvent: 'Rejected', sanitizedError: 'Autentikasi provider ditolak; credential tidak ditampilkan.', retryEligible: false },
]

export const sampleDeliveries: DeliverySnapshot[] = [
  { id: 'delivery-001', channel: 'email', recipient: 'ta***@example.com', template: 'booking-confirmed', status: 'delivered', attempts: 1, updatedAt: '2026-10-03T03:01:00Z', reference: 'BOOKING-SAMPLE-001', retryEligible: false, timeline: [{ status: 'accepted', at: '2026-10-03T03:00:00Z' }, { status: 'delivered', at: '2026-10-03T03:01:00Z' }] },
  { id: 'delivery-002', channel: 'whatsapp', recipient: '+62 812••••1234', template: 'arrival-reminder', status: 'queued', attempts: 2, updatedAt: '2026-10-03T02:58:00Z', reference: 'BOOKING-SAMPLE-002', retryEligible: false, timeline: [{ status: 'accepted', at: '2026-10-03T02:55:00Z' }, { status: 'queued', at: '2026-10-03T02:58:00Z' }] },
  { id: 'delivery-003', channel: 'email', recipient: 'gu***@example.com', template: 'payment-recovery', status: 'failed', attempts: 3, updatedAt: '2026-10-03T02:25:00Z', reference: 'BOOKING-SAMPLE-003', retryEligible: true, timeline: [{ status: 'accepted', at: '2026-10-03T02:20:00Z' }, { status: 'failed', at: '2026-10-03T02:25:00Z' }] },
]

export const sampleAudits: AuditSnapshot[] = [
  { id: 'audit-001', actor: 'staff:receptionist_sample', role: 'receptionist', action: 'room.move.preview', target: 'demo-stay-001', resourceType: 'booking', occurredAt: '2026-10-03T02:15:00Z', result: 'success', before: { room: '401' }, after: { room: '302' } },
  { id: 'audit-002', actor: 'staff:housekeeping_sample', role: 'housekeeping', action: 'finance.refund', target: 'demo-booking-002', resourceType: 'booking', occurredAt: '2026-10-03T01:41:00Z', result: 'denied', before: { permission: 'none' }, after: { permission: 'none' } },
  { id: 'audit-003', actor: 'staff:gm_sample', role: 'gm_admin', action: 'policy.update.preview', target: 'hotel-policy', resourceType: 'configuration', occurredAt: '2026-10-02T23:05:00Z', result: 'success', before: { check_in: '14:00' }, after: { check_in: '15:00' } },
]

export const samplePromos: PromoSnapshot[] = [
  { code: 'PULANG10', type: 'percent', value: 10, status: 'active', startsAt: '2026-10-01', endsAt: '2026-10-31' },
  { code: 'WEEKDAY150', type: 'fixed', value: 150000, status: 'scheduled', startsAt: '2026-11-01', endsAt: '2026-11-30' },
  { code: 'LIBURAN', type: 'percent', value: 15, status: 'expired', startsAt: '2026-08-01', endsAt: '2026-08-31' },
]
