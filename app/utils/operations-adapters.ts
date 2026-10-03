import type {
  BackendDailyRoster,
  BackendExtendStayResult,
  BackendFinanceCases,
  BackendHandovers,
  BackendReconciliationSummary,
  BackendRefundResponse,
  BackendRoomBoard,
  BackendRoomMoveResult,
  BackendRoomMoves,
} from '~~/shared/types/backend'
import type { DailyRoster, ExtendStayResult, FinanceCases, HandoverPage, ReconciliationSummary, RefundResult, RoomBoard, RoomMove, RoomMoveResult } from '~/types/operations'

export function toRoomBoard(value: BackendRoomBoard): RoomBoard {
  return {
    totalRooms: value.total_rooms,
    summary: value.summary,
    rooms: (value.rooms || []).map(room => ({
      roomNumber: room.room_number,
      roomTypeId: room.room_type_id,
      roomTypeName: room.room_type_name,
      floor: room.floor,
      status: room.cleanliness_status,
      maintenanceNotes: room.maintenance_notes,
      currentBookingId: room.current_booking_id,
      guestName: room.guest_name,
      updatedAt: room.updated_at,
      updatedBy: room.updated_by,
    })),
  }
}

export function toDailyRoster(value: BackendDailyRoster): DailyRoster {
  return {
    date: value.date,
    metrics: {
      totalRooms: value.metrics.total_rooms,
      sellableRooms: value.metrics.sellable_rooms,
      outOfOrderRooms: value.metrics.out_of_order_rooms,
      occupiedRooms: value.metrics.occupied_rooms,
      vacantInspectedRooms: value.metrics.vacant_inspected_rooms,
      vacantDirtyRooms: value.metrics.vacant_dirty_rooms,
      cleaningRooms: value.metrics.cleaning_rooms,
      occupancyRatePercent: value.metrics.occupancy_rate_percent,
    },
    expectedArrivals: (value.expected_arrivals || []).map(item => ({ bookingId: item.booking_id, guestName: item.guest_name, guestPhone: item.guest_phone, roomTypeId: item.room_type_id, roomTypeName: item.room_type_name, assignedRooms: item.assigned_rooms || [], numRooms: item.num_rooms, numGuests: item.num_guests, estimatedArrivalTime: item.estimated_arrival_time, specialRequests: item.special_requests, totalPriceMinor: item.total_price_minor })),
    expectedDepartures: (value.expected_departures || []).map(item => ({ bookingId: item.booking_id, guestName: item.guest_name, roomNumbers: item.room_numbers || [], checkInDate: item.check_in_date, checkOutDate: item.check_out_date })),
    inHouseCount: value.in_house_count,
  }
}

export function toHandovers(value: BackendHandovers): HandoverPage {
  return { total: value.total, notes: (value.notes || []).map(item => ({ id: item.id, shift: item.shift, cashFloatMinor: item.cash_float_minor, pendingIssues: item.pending_issues, vipGuestNotes: item.vip_guest_notes, actorId: item.actor_id, actorRole: item.actor_role, createdAt: item.created_at })) }
}

export function toRoomMoves(value: BackendRoomMoves): RoomMove[] {
  return (value.moves || []).map(item => ({ id: item.id, bookingId: item.booking_id, fromRoomNumber: item.from_room_number, toRoomNumber: item.to_room_number, moveDate: item.move_date, reasonCategory: item.reason_category as RoomMove['reasonCategory'], notes: item.notes, actorId: item.actor_id, createdAt: item.created_at }))
}

export function toRoomMoveResult(value: BackendRoomMoveResult): RoomMoveResult { return { status: value.status, bookingId: value.booking_id, previousRoomNumber: value.previous_room_number, newRoomNumber: value.new_room_number, moveDate: value.move_date, message: value.message } }
export function toExtendStayResult(value: BackendExtendStayResult): ExtendStayResult { return { status: value.status, bookingId: value.booking_id, previousCheckOut: value.previous_check_out, newCheckOut: value.new_check_out, additionalNights: value.additional_nights, additionalAmountMinor: value.additional_amount_minor, newTotalPriceMinor: value.new_total_price_minor, paymentStatus: value.payment_status } }
export function toReconciliation(value: BackendReconciliationSummary): ReconciliationSummary { return { totalSettledMinor: value.total_settled_minor, totalRefundedMinor: value.total_refunded_minor, netCapturedMinor: value.net_captured_minor, openCasesCount: value.open_cases_count, totalRefundsCount: value.total_refunds_count } }
export function toFinanceCases(value: BackendFinanceCases): FinanceCases { return { total: value.total, cases: (value.cases || []).map(item => ({ id: item.id, bookingId: item.booking_id, caseType: item.case_type, status: item.status, amountMinor: item.amount_minor, currency: item.currency, providerReference: item.provider_reference, notes: item.notes, resolvedBy: item.resolved_by, resolvedAt: item.resolved_at, resolutionAction: item.resolution_action, createdAt: item.created_at, updatedAt: item.updated_at })) } }
export function toRefund(value: BackendRefundResponse): RefundResult { return { id: value.refund.id, bookingId: value.refund.booking_id, referenceId: value.refund.reference_id, amountMinor: value.refund.amount_minor, currency: value.refund.currency, reason: value.refund.reason, status: value.refund.status, createdAt: value.refund.created_at } }
