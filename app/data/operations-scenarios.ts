import type { DailyRoster, HandoverNote, OperationalRoom, PaymentCase, ReconciliationSummary, RoomMove } from '~/types/operations'

export const sampleRooms: OperationalRoom[] = [
  { roomNumber: '301', roomTypeId: 'deluxe-king-bay', roomTypeName: 'Deluxe King Bay', floor: 3, status: 'vacant_dirty', maintenanceNotes: '', updatedAt: '2026-10-03T01:10:00Z', updatedBy: 'staff:housekeeping' },
  { roomNumber: '302', roomTypeId: 'deluxe-twin-bay', roomTypeName: 'Deluxe Twin Bay', floor: 3, status: 'cleaning', maintenanceNotes: '', updatedAt: '2026-10-03T02:05:00Z', updatedBy: 'staff:housekeeping' },
  { roomNumber: '305', roomTypeId: 'deluxe-king-bay', roomTypeName: 'Deluxe King Bay', floor: 3, status: 'inspected', maintenanceNotes: '', updatedAt: '2026-10-03T02:25:00Z', updatedBy: 'staff:supervisor' },
  { roomNumber: '401', roomTypeId: 'executive-suite', roomTypeName: 'Executive Suite', floor: 4, status: 'occupied', maintenanceNotes: '', currentBookingId: 'demo-stay-001', guestName: 'Tamu Sample', updatedAt: '2026-10-03T00:10:00Z', updatedBy: 'front_desk' },
  { roomNumber: '402', roomTypeId: 'executive-suite', roomTypeName: 'Executive Suite', floor: 4, status: 'out_of_service', maintenanceNotes: 'Pemeriksaan AC', updatedAt: '2026-10-02T09:00:00Z', updatedBy: 'staff:housekeeping' },
  { roomNumber: '501', roomTypeId: 'suite-room', roomTypeName: 'Suite Room', floor: 5, status: 'out_of_order', maintenanceNotes: 'Perbaikan kamar mandi', updatedAt: '2026-10-01T07:00:00Z', updatedBy: 'staff:gm_admin' },
]

export const sampleRoster: DailyRoster = {
  date: '2026-10-03',
  metrics: { totalRooms: 95, sellableRooms: 93, outOfOrderRooms: 2, occupiedRooms: 61, vacantInspectedRooms: 20, vacantDirtyRooms: 8, cleaningRooms: 4, occupancyRatePercent: 65.59 },
  expectedArrivals: [
    { bookingId: 'demo-arrival-001', guestName: 'Tamu Arrival', guestPhone: '+62 812••••1234', roomTypeId: 'deluxe-king-bay', roomTypeName: 'Deluxe King Bay', assignedRooms: ['305'], numRooms: 1, numGuests: 2, estimatedArrivalTime: '16:00', specialRequests: 'Lantai tenang', totalPriceMinor: 1250000 },
    { bookingId: 'demo-arrival-002', guestName: 'Tamu Belum Ditugaskan', roomTypeId: 'deluxe-twin-bay', roomTypeName: 'Deluxe Twin Bay', assignedRooms: [], numRooms: 1, numGuests: 2, totalPriceMinor: 1190000 },
  ],
  expectedDepartures: [{ bookingId: 'demo-stay-001', guestName: 'Tamu Sample', roomNumbers: ['401'], checkInDate: '2026-10-01', checkOutDate: '2026-10-03' }],
  inHouseCount: 61,
}

export const sampleHandovers: HandoverNote[] = [
  { id: 'handover-001', shift: 'morning', cashFloatMinor: 2500000, pendingIssues: 'Kamar 402 menunggu pemeriksaan AC.', vipGuestNotes: 'Arrival sore meminta kamar tenang.', actorId: 'staff:receptionist_sample', actorRole: 'receptionist', createdAt: '2026-10-03T00:15:00Z' },
]

export const sampleMoves: RoomMove[] = [{ id: 'move-001', bookingId: 'demo-stay-001', fromRoomNumber: '303', toRoomNumber: '401', moveDate: '2026-10-02', reasonCategory: 'upgrade', notes: 'Sample perpindahan kamar', actorId: 'staff:receptionist_sample', createdAt: '2026-10-02T05:00:00Z' }]
export const sampleReconciliation: ReconciliationSummary = { totalSettledMinor: 128450000, totalRefundedMinor: 3250000, netCapturedMinor: 125200000, openCasesCount: 2, totalRefundsCount: 4 }
export const sampleCases: PaymentCase[] = [
  { id: 'case-001', bookingId: 'demo-late-001', caseType: 'late_payment', status: 'open', amountMinor: 1250000, currency: 'IDR', providerReference: 'sample-provider-001', notes: 'Pembayaran diterima setelah hold berakhir.', createdAt: '2026-10-03T02:10:00Z', updatedAt: '2026-10-03T02:10:00Z' },
  { id: 'case-002', bookingId: 'demo-duplicate-001', caseType: 'duplicate_payment', status: 'investigating', amountMinor: 980000, currency: 'IDR', providerReference: 'sample-provider-002', notes: 'Perlu verifikasi ledger.', createdAt: '2026-10-02T04:00:00Z', updatedAt: '2026-10-03T01:00:00Z' },
]
