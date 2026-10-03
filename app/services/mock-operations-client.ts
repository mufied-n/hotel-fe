import { sampleCases, sampleHandovers, sampleMoves, sampleReconciliation, sampleRooms, sampleRoster } from '~/data/operations-scenarios'
import type { CleanlinessStatus, DailyRoster, HandoverNote, OperationsClient, RecordHandoverInput, RefundResult, RoomMove } from '~/types/operations'
import { OperationsError } from '~/types/operations'
import { addDays } from '~/utils/dates'
import type { OperationsQAControls, QAOperation } from '~/utils/qa-controls'

export function createMockOperationsClient(qa: OperationsQAControls = { delayMs: 0, failAfter: Number.MAX_SAFE_INTEGER }): OperationsClient {
  const rooms = structuredClone(sampleRooms)
  const handovers = structuredClone(sampleHandovers)
  const moves = structuredClone(sampleMoves)
  const cases = structuredClone(sampleCases)
  const calls = new Map<string, number>()
  async function wait(operation?: QAOperation) {
    await new Promise(resolve => setTimeout(resolve, qa.delayMs || (import.meta.dev ? 100 : 5)))
    if (!operation) return
    const count = (calls.get(operation) || 0) + 1
    calls.set(operation, count)
    if (qa.failOperation === operation && count > qa.failAfter) throw new OperationsError('QA_CONTROLLED_FAILURE', `Kegagalan sample terkontrol pada ${operation}.`, 503)
  }
  return {
    async getRoomBoard(filters = {}) {
      await wait('room-board')
      const filtered = rooms.filter(room => (!filters.floor || room.floor === filters.floor) && (!filters.status || room.status === filters.status) && (!filters.roomTypeId || room.roomTypeId === filters.roomTypeId))
      const statuses: CleanlinessStatus[] = ['vacant_dirty', 'cleaning', 'vacant_clean', 'inspected', 'occupied', 'out_of_service', 'out_of_order']
      return { totalRooms: filtered.length, summary: Object.fromEntries(statuses.map(status => [status, filtered.filter(room => room.status === status).length])) as Record<CleanlinessStatus, number>, rooms: structuredClone(filtered) }
    },
    async updateRoomStatus(roomNumber, status, notes) {
      await wait(); const room = rooms.find(item => item.roomNumber === roomNumber); if (!room) throw new OperationsError('ROOM_NOT_FOUND', 'Kamar tidak ditemukan.', 404)
      room.status = status; room.maintenanceNotes = notes; room.updatedAt = new Date().toISOString(); room.updatedBy = 'staff:sample'
    },
    async markOutOfOrder(roomNumber, input) {
      await wait(); if (input.startDate >= input.endDate) throw new OperationsError('INVALID_DATE_RANGE', 'Tanggal akhir harus setelah tanggal mulai.', 400)
      const room = rooms.find(item => item.roomNumber === roomNumber); if (!room) throw new OperationsError('ROOM_NOT_FOUND', 'Kamar tidak ditemukan.', 404)
      room.status = 'out_of_order'; room.maintenanceNotes = input.reason; room.updatedAt = new Date().toISOString(); room.updatedBy = 'staff:gm_admin_sample'
    },
    async getDailyRoster(date): Promise<DailyRoster> { await wait('daily-roster'); return { ...structuredClone(sampleRoster), date } },
    async getHandovers(limit = 20, offset = 0) { await wait(); return { total: handovers.length, notes: structuredClone(handovers.slice(offset, offset + limit)) } },
    async recordHandover(input: RecordHandoverInput): Promise<HandoverNote> {
      await wait(); if (!input.pendingIssues.trim() && !input.vipGuestNotes.trim()) throw new OperationsError('INVALID_INPUT', 'Isi minimal satu catatan handover.', 400)
      const note: HandoverNote = { id: `handover-${handovers.length + 1}`, ...input, actorId: 'staff:receptionist_sample', actorRole: 'receptionist', createdAt: new Date().toISOString() }; handovers.unshift(note); return structuredClone(note)
    },
    async getRoomMoves(bookingId): Promise<RoomMove[]> { await wait(); return structuredClone(moves.filter(move => move.bookingId === bookingId)) },
    async moveRoom(bookingId, input) {
      await wait(); if (input.targetRoomNumber === '401') throw new OperationsError('INVALID_INPUT', 'Kamar tujuan sama dengan kamar saat ini.', 400)
      const target = rooms.find(room => room.roomNumber === input.targetRoomNumber); if (!target || target.status !== 'inspected') throw new OperationsError('TARGET_ROOM_NOT_READY', 'Kamar tujuan belum siap.', 409)
      const result = { status: 'ok', bookingId, previousRoomNumber: '401', newRoomNumber: input.targetRoomNumber, moveDate: '2026-10-03', message: 'Simulasi perpindahan kamar selesai.' }
      moves.unshift({ id: `move-${moves.length + 1}`, bookingId, fromRoomNumber: '401', toRoomNumber: input.targetRoomNumber, moveDate: result.moveDate, reasonCategory: input.reasonCategory, notes: input.notes, actorId: 'staff:sample', createdAt: new Date().toISOString() }); return result
    },
    async extendStay(bookingId, input) {
      await wait(); if (input.additionalNights < 1 || input.additionalNights > 30) throw new OperationsError('INVALID_ADDITIONAL_NIGHTS', 'Tambahan malam harus 1–30.', 400)
      return { status: 'ok', bookingId, previousCheckOut: '2026-10-04', newCheckOut: addDays('2026-10-04', input.additionalNights), additionalNights: input.additionalNights, additionalAmountMinor: 750000 * input.additionalNights, newTotalPriceMinor: 2500000 + 750000 * input.additionalNights, paymentStatus: 'sample_only' }
    },
    async getReconciliation() { await wait(); return structuredClone(sampleReconciliation) },
    async getFinanceCases(status, limit = 50) { await wait('finance-cases'); const filtered = cases.filter(item => !status || item.status === status).slice(0, limit); return { total: filtered.length, cases: structuredClone(filtered) } },
    async resolveCase(caseId, action, notes) { await wait(); const item = cases.find(entry => entry.id === caseId); if (!item) throw new OperationsError('CASE_NOT_FOUND', 'Kasus tidak ditemukan.', 404); item.status = action === 'dismiss' ? 'dismissed' : 'resolved'; item.resolutionAction = action; item.notes = notes || item.notes; item.updatedAt = new Date().toISOString() },
    async createRefund(input): Promise<RefundResult> { await wait(); if (input.amountMinor <= 0) throw new OperationsError('INVALID_AMOUNT', 'Nominal harus lebih dari nol.', 400); if (input.reason.trim().length < 5) throw new OperationsError('REASON_REQUIRED', 'Alasan minimal 5 karakter.', 400); return { id: 'refund-sample-001', bookingId: input.bookingId, referenceId: 'RFND-SAMPLE', amountMinor: input.amountMinor, currency: 'IDR', reason: input.reason.trim(), status: 'pending', createdAt: new Date().toISOString() } },
  }
}
