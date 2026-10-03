export interface BackendPhoto { url: string, alt: string }

export interface BackendRoomVariant {
  id: string
  code: string
  name: string
  family_name: string
  bed_type: string
  room_size_sqm: number
  max_capacity: number
  max_adults: number
  max_children: number
  description: string
  base_price_minor: number
  amenities: string[]
  photos: BackendPhoto[]
}
export interface BackendAvailabilityResponse {
  availability: Array<{ date: string, total_rooms: number, available_rooms: number }>
  quotes: Array<{ date: string, rate_minor: number }>
  total_minor: number
}

export interface BackendSearchItem {
  room_variant: BackendRoomVariant
  available: boolean
  available_rooms: number
  unavailable_reason?: string
  total_price_minor: number
  currency: 'IDR'
  quotes: Array<{ date: string, rate_minor: number }>
}

export interface BackendSearchResponse {
  search_criteria: { check_in: string, check_out: string, nights: number, rooms: number, adults: number, children: number }
  total_variants: number
  available_count: number
  results: BackendSearchItem[]
}

export interface BackendLockedQuote {
  quote_id: string
  created_at: string
  expires_at: string
  room_type_id: string
  rate_plan_code: string
  rate_plan_name: string
  cancellation_policy: string
  cancellation_description: string
  check_in: string
  check_out: string
  num_rooms: number
  num_guests: number
  nightly_rates: Array<{ date: string, rate_minor: number }>
  pricing: {
    room_subtotal_minor: number
    breakfast_charge_minor: number
    discount_minor: number
    tax_minor: number
    total_price_minor: number
    currency: 'IDR'
  }
}

export type BackendBookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'expired' | 'failed' | 'no_show'

export interface BackendBooking {
  id: string
  room_type_id: string
  check_in: string
  check_out: string
  num_rooms: number
  num_guests?: number
  status: BackendBookingStatus
  quote_id?: string
  rate_plan_code?: string
  cancellation_policy?: string
  cancellation_description?: string
  room_subtotal_minor?: number
  breakfast_charge_minor?: number
  discount_minor?: number
  tax_minor?: number
  total_price_minor?: number
  currency?: 'IDR'
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  estimated_arrival_time?: string
  special_requests?: string
  expires_at?: string
  created_at: string
}

export interface BackendCreateBookingResponse {
  booking: BackendBooking
  guest_access_token?: string
  payment_url?: string
  reference?: string
  expires_at?: string
  server_time: string
}

export interface GuestProfile {
  email: string
  active_bookings_count: number
  last_active_at: string
  expires_at: string
}

export interface GuestBookingSummary {
  id: string
  room_type_id: string
  room_type_name: string
  check_in: string
  check_out: string
  num_rooms: number
  num_guests: number
  status: BackendBookingStatus
  total_price_minor: number
  currency: 'IDR'
  created_at: string
}

export interface GuestAllowedActions {
  can_pay: boolean
  can_cancel: boolean
  can_download_receipt: boolean
  can_request_assistance: boolean
}

export interface GuestBookingDetail extends GuestBookingSummary {
  guest_name: string
  guest_email: string
  guest_phone: string
  estimated_arrival_time?: string
  special_requests?: string
  allowed_actions: GuestAllowedActions
}

export interface GuestReceipt {
  invoice_number: string
  invoice_date: string
  booking_id: string
  booking_reference: string
  status: string
  hotel_info: { name: string, tagline: string, address: string, phone: string, email: string, website: string }
  stay_details: { check_in_date: string, check_in_time: string, check_out_date: string, check_out_time: string, total_nights: number, timezone: string }
  guest_details: { name: string, email: string, phone: string, num_rooms: number, num_guests: number, special_requests?: string }
  room_item: { room_type_id: string, room_type_name: string, rate_plan_code: string, meal_plan: string, num_rooms: number, total_nights: number, nightly_rate_minor: number, subtotal_minor: number }
  pricing_breakdown: { currency: 'IDR', room_subtotal_minor: number, breakfast_charge_minor: number, discount_minor: number, tax_minor: number, total_price_minor: number }
  payment_summary: { status: string, provider: string, provider_reference?: string, paid_at?: string }
  policies: { check_in_policy: string, cancellation_policy: string }
  qr_payload: string
}

export interface GuestRefundStatus {
  booking_id: string
  has_refund: boolean
  refunds: Array<{ id: string, amount_minor: number, currency: string, reason: string, status: string, created_at: string, updated_at?: string }>
}

export type GuestRequestCategory = 'early_arrival' | 'late_departure' | 'high_floor' | 'quiet_room' | 'bed_type' | 'celebration_setup' | 'baby_crib' | 'dietary_allergy' | 'other'
export interface GuestSpecialRequest {
  id: string
  booking_id: string
  category: GuestRequestCategory
  department: 'front_desk' | 'housekeeping'
  description: string
  target_time?: string
  status: 'pending' | 'acknowledged' | 'fulfilled' | 'declined'
  staff_notes?: string
  created_at: string
  updated_at: string
}
export interface GuestSpecialRequestsResponse { booking_id: string, requests: GuestSpecialRequest[] }

export interface BackendProblem { error?: string, code?: string, title?: string, detail?: string, message?: string, status?: number }

export type BackendStaffRole = 'receptionist' | 'housekeeping' | 'revenue_mgr' | 'finance' | 'gm_admin'
export interface BackendStaffPrincipal { username: string, role: BackendStaffRole, full_name?: string }
export interface BackendStaffLoginResponse { token: string, expires_at: string, staff: BackendStaffPrincipal }

export type BackendCleanlinessStatus = 'vacant_dirty' | 'cleaning' | 'vacant_clean' | 'inspected' | 'occupied' | 'out_of_service' | 'out_of_order'
export interface BackendOperationalRoom {
  room_number: string
  room_type_id: string
  room_type_name: string
  floor: number
  cleanliness_status: BackendCleanlinessStatus
  maintenance_notes: string
  current_booking_id?: string
  guest_name?: string
  updated_at: string
  updated_by: string
}
export interface BackendRoomBoard { total_rooms: number, summary: Record<BackendCleanlinessStatus, number>, rooms: BackendOperationalRoom[] | null }
export interface BackendRosterMetrics { total_rooms: number, sellable_rooms: number, out_of_order_rooms: number, occupied_rooms: number, vacant_inspected_rooms: number, vacant_dirty_rooms: number, cleaning_rooms: number, occupancy_rate_percent: number }
export interface BackendArrival { booking_id: string, guest_name: string, guest_phone?: string, room_type_id: string, room_type_name: string, assigned_rooms: string[] | null, num_rooms: number, num_guests: number, estimated_arrival_time?: string, special_requests?: string, total_price_minor: number }
export interface BackendDeparture { booking_id: string, guest_name: string, room_numbers: string[] | null, check_in_date: string, check_out_date: string }
export interface BackendDailyRoster { date: string, metrics: BackendRosterMetrics, expected_arrivals: BackendArrival[] | null, expected_departures: BackendDeparture[] | null, in_house_count: number }
export interface BackendHandoverNote { id: string, shift: 'morning' | 'afternoon' | 'night', cash_float_minor: number, pending_issues: string, vip_guest_notes: string, actor_id: string, actor_role: string, created_at: string }
export interface BackendHandovers { total: number, notes: BackendHandoverNote[] | null }
export interface BackendRoomMove { id: string, booking_id: string, from_room_number: string, to_room_number: string, move_date: string, reason_category: string, notes: string, actor_id: string, created_at: string }
export interface BackendRoomMoves { booking_id: string, moves: BackendRoomMove[] | null }
export interface BackendRoomMoveResult { status: string, booking_id: string, previous_room_number: string, new_room_number: string, move_date: string, message: string }
export interface BackendExtendStayResult { status: string, booking_id: string, previous_check_out: string, new_check_out: string, additional_nights: number, additional_amount_minor: number, new_total_price_minor: number, payment_status?: string }
export interface BackendReconciliationSummary { total_settled_minor: number, total_refunded_minor: number, net_captured_minor: number, open_cases_count: number, total_refunds_count: number }
export interface BackendPaymentCase { id: string, booking_id?: string, case_type: string, status: 'open' | 'investigating' | 'resolved' | 'dismissed', amount_minor: number, currency: string, provider_reference: string, notes: string, resolved_by?: string, resolved_at?: string, resolution_action?: string, created_at: string, updated_at: string }
export interface BackendFinanceCases { total: number, cases: BackendPaymentCase[] | null }
export interface BackendRefund { id: string, booking_id: string, reference_id: string, amount_minor: number, currency: string, reason: string, status: string, created_at: string }
export interface BackendRefundResponse { status: string, refund: BackendRefund }
