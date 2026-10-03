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

export interface BackendProblem { error?: string, code?: string, title?: string, detail?: string, message?: string, status?: number }
