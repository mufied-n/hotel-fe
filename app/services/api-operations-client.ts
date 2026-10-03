import type { OperationsClient } from '~/types/operations'
import { OperationsError } from '~/types/operations'
import type { BackendDailyRoster, BackendExtendStayResult, BackendFinanceCases, BackendHandovers, BackendReconciliationSummary, BackendRefundResponse, BackendRoomBoard, BackendRoomMoveResult, BackendRoomMoves } from '~~/shared/types/backend'
import { toDailyRoster, toExtendStayResult, toFinanceCases, toHandovers, toReconciliation, toRefund, toRoomBoard, toRoomMoveResult, toRoomMoves } from '~/utils/operations-adapters'

function failure(cause: unknown): OperationsError {
  const value = cause as { statusCode?: number, statusMessage?: string, data?: { statusMessage?: string, data?: { code?: string } } }
  const status = value.statusCode || 500
  return new OperationsError(value.data?.data?.code || 'SERVICE_UNAVAILABLE', value.data?.statusMessage || value.statusMessage || 'Workspace staff belum tersedia.', status)
}
async function request<T>(path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
  try { return await $fetch<T>(path, options) as T }
  catch (cause) { throw failure(cause) }
}
const mutation = { 'X-Pulang-CSRF': '1' }

export function createApiOperationsClient(): OperationsClient {
  return {
    getRoomBoard: async filters => toRoomBoard(await request<BackendRoomBoard>('/api/bff/staff/housekeeping/rooms', { query: { floor: filters?.floor, status: filters?.status, room_type_id: filters?.roomTypeId } })),
    updateRoomStatus: (id, status, notes) => request(`/api/bff/staff/housekeeping/rooms/${encodeURIComponent(id)}/status`, { method: 'PUT', headers: mutation, body: { to_status: status, notes } }),
    markOutOfOrder: (id, input) => request(`/api/bff/staff/housekeeping/rooms/${encodeURIComponent(id)}/out-of-order`, { method: 'POST', headers: mutation, body: { start_date: input.startDate, end_date: input.endDate, reason: input.reason } }),
    getDailyRoster: async date => toDailyRoster(await request<BackendDailyRoster>('/api/bff/staff/front-desk/daily-roster', { query: { date } })),
    getHandovers: async (limit, offset) => toHandovers(await request<BackendHandovers>('/api/bff/staff/front-desk/handover-notes', { query: { limit, offset } })),
    recordHandover: input => request('/api/bff/staff/front-desk/handover-notes', { method: 'POST', headers: mutation, body: { shift: input.shift, cash_float_minor: input.cashFloatMinor, pending_issues: input.pendingIssues, vip_guest_notes: input.vipGuestNotes } }),
    getRoomMoves: async id => toRoomMoves(await request<BackendRoomMoves>(`/api/bff/staff/bookings/${encodeURIComponent(id)}/room-moves`)),
    moveRoom: async (id, input) => toRoomMoveResult(await request<BackendRoomMoveResult>(`/api/bff/staff/bookings/${encodeURIComponent(id)}/room-move`, { method: 'POST', headers: mutation, body: { target_room_number: input.targetRoomNumber, reason_category: input.reasonCategory, notes: input.notes } })),
    extendStay: async (id, input) => toExtendStayResult(await request<BackendExtendStayResult>(`/api/bff/staff/bookings/${encodeURIComponent(id)}/extend-stay`, { method: 'POST', headers: mutation, body: { additional_nights: input.additionalNights, payment_method: input.paymentMethod } })),
    getReconciliation: async () => toReconciliation(await request<BackendReconciliationSummary>('/api/bff/staff/finance/reconciliations')),
    getFinanceCases: async (status, limit) => toFinanceCases(await request<BackendFinanceCases>('/api/bff/staff/finance/cases', { query: { status, limit } })),
    resolveCase: (id, action, notes) => request(`/api/bff/staff/finance/cases/${encodeURIComponent(id)}/resolve`, { method: 'POST', headers: mutation, body: { action, notes } }),
    createRefund: async input => toRefund(await request<BackendRefundResponse>('/api/bff/staff/finance/refunds', { method: 'POST', headers: mutation, body: { booking_id: input.bookingId, amount_minor: input.amountMinor, reason: input.reason } })),
  }
}
