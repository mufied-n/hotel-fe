export type CleanlinessStatus = 'vacant_dirty' | 'cleaning' | 'vacant_clean' | 'inspected' | 'occupied' | 'out_of_service' | 'out_of_order'

export interface OperationalRoom {
  roomNumber: string
  roomTypeId: string
  roomTypeName: string
  floor: number
  status: CleanlinessStatus
  maintenanceNotes: string
  currentBookingId?: string
  guestName?: string
  updatedAt: string
  updatedBy: string
}

export interface RoomBoard { totalRooms: number, summary: Record<CleanlinessStatus, number>, rooms: OperationalRoom[] }
export interface RosterMetrics { totalRooms: number, sellableRooms: number, outOfOrderRooms: number, occupiedRooms: number, vacantInspectedRooms: number, vacantDirtyRooms: number, cleaningRooms: number, occupancyRatePercent: number }
export interface Arrival { bookingId: string, guestName: string, guestPhone?: string, roomTypeId: string, roomTypeName: string, assignedRooms: string[], numRooms: number, numGuests: number, estimatedArrivalTime?: string, specialRequests?: string, totalPriceMinor: number }
export interface Departure { bookingId: string, guestName: string, roomNumbers: string[], checkInDate: string, checkOutDate: string }
export interface DailyRoster { date: string, metrics: RosterMetrics, expectedArrivals: Arrival[], expectedDepartures: Departure[], inHouseCount: number }
export type Shift = 'morning' | 'afternoon' | 'night'
export interface HandoverNote { id: string, shift: Shift, cashFloatMinor: number, pendingIssues: string, vipGuestNotes: string, actorId: string, actorRole: string, createdAt: string }
export interface HandoverPage { total: number, notes: HandoverNote[] }
export interface RecordHandoverInput { shift: Shift, cashFloatMinor: number, pendingIssues: string, vipGuestNotes: string }
export type MoveReason = 'maintenance_defect' | 'noise_complaint' | 'upgrade' | 'guest_request'
export interface RoomMove { id: string, bookingId: string, fromRoomNumber: string, toRoomNumber: string, moveDate: string, reasonCategory: MoveReason, notes: string, actorId: string, createdAt: string }
export interface RoomMoveResult { status: string, bookingId: string, previousRoomNumber: string, newRoomNumber: string, moveDate: string, message: string }
export interface ExtendStayResult { status: string, bookingId: string, previousCheckOut: string, newCheckOut: string, additionalNights: number, additionalAmountMinor: number, newTotalPriceMinor: number, paymentStatus?: string }
export interface ReconciliationSummary { totalSettledMinor: number, totalRefundedMinor: number, netCapturedMinor: number, openCasesCount: number, totalRefundsCount: number }
export type PaymentCaseStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'
export interface PaymentCase { id: string, bookingId?: string, caseType: string, status: PaymentCaseStatus, amountMinor: number, currency: string, providerReference: string, notes: string, resolvedBy?: string, resolvedAt?: string, resolutionAction?: string, createdAt: string, updatedAt: string }
export interface FinanceCases { total: number, cases: PaymentCase[] }
export interface RefundResult { id: string, bookingId: string, referenceId: string, amountMinor: number, currency: string, reason: string, status: string, createdAt: string }

export class OperationsError extends Error {
  constructor(public code: string, message: string, public status = 500) { super(message); this.name = 'OperationsError' }
}

export interface OperationsClient {
  getRoomBoard(filters?: { floor?: number, status?: string, roomTypeId?: string }): Promise<RoomBoard>
  updateRoomStatus(roomNumber: string, status: CleanlinessStatus, notes: string): Promise<void>
  markOutOfOrder(roomNumber: string, input: { startDate: string, endDate: string, reason: string }): Promise<void>
  getDailyRoster(date: string): Promise<DailyRoster>
  getHandovers(limit?: number, offset?: number): Promise<HandoverPage>
  recordHandover(input: RecordHandoverInput): Promise<HandoverNote>
  getRoomMoves(bookingId: string): Promise<RoomMove[]>
  moveRoom(bookingId: string, input: { targetRoomNumber: string, reasonCategory: MoveReason, notes: string }): Promise<RoomMoveResult>
  extendStay(bookingId: string, input: { additionalNights: number, paymentMethod: string }): Promise<ExtendStayResult>
  getReconciliation(): Promise<ReconciliationSummary>
  getFinanceCases(status?: string, limit?: number): Promise<FinanceCases>
  resolveCase(caseId: string, action: string, notes: string): Promise<void>
  createRefund(input: { bookingId: string, amountMinor: number, reason: string }): Promise<RefundResult>
}
