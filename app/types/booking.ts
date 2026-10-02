export type DateOnly = string

export interface Money { amount: number, currency: 'IDR', exponent: 2 }
export interface Occupancy { roomIndex: number, adults: number, childrenAges: number[] }
export interface SearchInput { checkIn: DateOnly, checkOut: DateOnly, occupancy: Occupancy[], promoCode?: string, locale: 'id-ID', currency: 'IDR' }
export interface Hotel { name: string, address: string, email: string, phone: string, timezone: 'Asia/Jakarta', checkInTime: string, checkOutTime: string }
export interface RoomVariant { id: string, familyId: string, name: string, bed: string, capacity: number, capacityStatus: 'sample', features: string[], imageAlt: string }
export interface RoomFamily { id: string, name: string, description: string, variants: RoomVariant[] }
export interface RatePlan { id: string, name: string, breakfast: boolean, benefits: string[], policy: string }
export interface QuoteItem { roomIndex: number, occupancy: Occupancy, variant: RoomVariant, ratePlan: RatePlan, original: Money, discount: Money, subtotal: Money, taxes: Money, service: Money, total: Money }
export interface PolicySnapshot { cancellation: string, payment: string, noShow: string, chargesIncluded: boolean }
export interface Quote { id: string, version: number, search: SearchInput, nights: number, items: QuoteItem[], original: Money, discount: Money, subtotal: Money, taxes: Money, service: Money, total: Money, expiresAt: string, serverTime: string, policySnapshot: PolicySnapshot }
export interface GuestDetails { fullName: string, email: string, specialRequests: string }
export interface BookingDraft { search: SearchInput | null, selectedQuote: Quote | null, guest: GuestDetails, consent: boolean, idempotencyKey: string | null }
export type BookingStatus = 'pending_payment' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'needs_assistance'
export interface BookingStatusView { id: string, reference: string, status: BookingStatus, serverTime: string, expiresAt: string, quote: Quote, guestName: string }
export type ApiErrorCode = 'VALIDATION_ERROR' | 'SOLD_OUT' | 'QUOTE_EXPIRED' | 'PRICE_CHANGED' | 'HOLD_EXPIRED' | 'PAYMENT_PENDING' | 'PAYMENT_FAILED' | 'UNAUTHORIZED' | 'SERVICE_UNAVAILABLE'
export interface ApiError { code: ApiErrorCode, message: string, fieldErrors?: Record<string, string>, retryable: boolean }
export interface SearchResult { rooms: RoomFamily[], search: SearchInput }
