import type { BackendBooking, BackendCreateBookingResponse, BackendLockedQuote, BackendSearchResponse } from '~~/shared/types/backend'
import type { BookingClient, QuoteSelection } from './booking-client'
import { BookingClientError } from './booking-client'
import { ratePlans } from '~/data/rate-plans'
import { ROOM_PHOTOS } from '~/data/rooms'
import type { ApiErrorCode, BookingDraft, BookingStatus, BookingStatusView, Occupancy, Quote, RoomFamily, RoomPhoto, RoomVariant, SearchInput, SearchResult } from '~/types/booking'
import { nightsBetween } from '~/utils/dates'
import { rupiah } from '~/utils/money'

function totalGuests(input: SearchInput) {
  return input.occupancy.reduce((sum, room) => sum + room.adults + room.childrenAges.length, 0)
}

function errorFrom(cause: unknown): BookingClientError {
  const value = cause as { statusCode?: number, statusMessage?: string, data?: { statusMessage?: string, data?: { code?: string } } }
  const status = value.statusCode || 500
  const rawCode = value.data?.data?.code || (status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : status >= 500 ? 'SERVICE_UNAVAILABLE' : 'VALIDATION_ERROR')
  return new BookingClientError({
    code: rawCode as ApiErrorCode,
    message: value.data?.statusMessage || value.statusMessage || 'Layanan booking belum dapat memproses permintaan.',
    retryable: status >= 500 || status === 429,
  })
}

function resolvePhotos(room: BackendSearchResponse['results'][number]['room_variant']): { imageUrl: string, photos: RoomPhoto[] } {
  if (room.photos && room.photos.length > 0) {
    const firstUrl = room.photos[0]?.url || ''
    if ((firstUrl.startsWith('http') || firstUrl.startsWith('/asset/rooms/')) && !firstUrl.includes('/images/rooms/')) {
      return {
        imageUrl: firstUrl,
        photos: room.photos.map(p => ({ url: p.url, alt: p.alt || room.name })),
      }
    }
  }

  const code = (room.code || '').toLowerCase()
  const family = (room.family_name || '').toLowerCase()

  if (family.includes('balcony') || code.includes('dlx') || family.includes('deluxe')) {
    const list = ROOM_PHOTOS['deluxe-balcony'] || []
    return { imageUrl: list[0]?.url || '', photos: list }
  }
  if (family.includes('bay') || code.includes('sup') || family.includes('superior')) {
    const list = ROOM_PHOTOS['deluxe-bay'] || []
    return { imageUrl: list[0]?.url || '', photos: list }
  }
  if (family.includes('executive') || code.includes('exc')) {
    const list = ROOM_PHOTOS['executive'] || []
    return { imageUrl: list[0]?.url || '', photos: list }
  }
  if (family.includes('family') || code.includes('pste') || family.includes('presidential')) {
    const list = ROOM_PHOTOS['family'] || []
    return { imageUrl: list[0]?.url || '', photos: list }
  }
  if (family.includes('suite') || code.includes('jste')) {
    const list = ROOM_PHOTOS['suite'] || []
    return { imageUrl: list[0]?.url || '', photos: list }
  }

  const fallback = ROOM_PHOTOS['deluxe-balcony'] || []
  return { imageUrl: fallback[0]?.url || '', photos: fallback }
}

function mapVariant(source: BackendSearchResponse['results'][number]): RoomVariant {
  const room = source.room_variant
  const { imageUrl, photos } = resolvePhotos(room)
  return {
    id: room.id,
    familyId: room.family_name || room.code,
    name: room.name,
    bed: room.bed_type,
    capacity: room.max_capacity,
    capacityStatus: 'verified',
    features: room.amenities || [],
    imageAlt: room.photos?.[0]?.alt || `Foto ${room.name}`,
    imageUrl,
    photos,
    startingPrice: rupiah(source.total_price_minor),
    availableRooms: source.available_rooms,
  }
}

function groupRooms(response: BackendSearchResponse) {
  const groups = new Map<string, RoomFamily>()
  for (const item of response.results.filter(item => item.available)) {
    const variant = mapVariant(item)
    const key = variant.familyId
    const current = groups.get(key)
    if (current) {
      current.variants.push(variant)
    }
    else {
      groups.set(key, {
        id: key,
        name: item.room_variant.family_name || item.room_variant.name,
        description: item.room_variant.description,
        imageUrl: variant.imageUrl,
        photos: variant.photos,
        variants: [variant],
      })
    }
  }
  return [...groups.values()]
}

function combinedOccupancy(input: SearchInput): Occupancy {
  return { roomIndex: 0, adults: input.occupancy.reduce((sum, room) => sum + room.adults, 0), childrenAges: input.occupancy.flatMap(room => room.childrenAges) }
}

function mapStatus(status: BackendBooking['status']): BookingStatus {
  return status
}

export function createApiBookingClient(): BookingClient {
  const variants = new Map<string, RoomVariant>()
  return {
    async search(input: SearchInput): Promise<SearchResult> {
      try {
        const response = await $fetch<BackendSearchResponse>('/api/bff/search', { query: {
          check_in: input.checkIn,
          check_out: input.checkOut,
          rooms: input.occupancy.length,
          adults: input.occupancy.reduce((sum, room) => sum + room.adults, 0),
          children: input.occupancy.reduce((sum, room) => sum + room.childrenAges.length, 0),
          child_ages: input.occupancy.flatMap(room => room.childrenAges).join(','),
        } })
        const rooms = groupRooms(response)
        for (const room of rooms) for (const variant of room.variants) variants.set(variant.id, variant)
        if (!rooms.length) throw new BookingClientError({ code: 'SOLD_OUT', message: 'Tidak ada kamar tersedia untuk pencarian ini.', retryable: false })
        return { search: input, rooms }
      }
      catch (cause) { if (cause instanceof BookingClientError) throw cause; throw errorFrom(cause) }
    },

    async quote(input: SearchInput, selection: QuoteSelection): Promise<Quote> {
      const variantIds = [...new Set(selection.variantIds)]
      const ratePlanIds = [...new Set(selection.ratePlanIds)]
      if (variantIds.length !== 1 || ratePlanIds.length !== 1) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Backend saat ini mendukung satu tipe kamar dan paket untuk seluruh jumlah kamar.', retryable: false })
      const variant = variants.get(variantIds[0]!)
      const ratePlan = ratePlans.find(plan => plan.id === ratePlanIds[0])
      if (!variant || !ratePlan) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Pilihan kamar atau paket tidak valid.', retryable: false })
      try {
        const response = await $fetch<BackendLockedQuote>('/api/bff/quotes', { method: 'POST', headers: { 'X-Pulang-CSRF': '1' }, body: {
          room_type_id: variant.id,
          rate_plan_code: ratePlan.id,
          check_in: input.checkIn,
          check_out: input.checkOut,
          num_rooms: input.occupancy.length,
          num_guests: totalGuests(input),
          promo_code: input.promoCode || '',
        } })
        const original = response.pricing.room_subtotal_minor + response.pricing.breakfast_charge_minor
        const subtotal = original - response.pricing.discount_minor
        return {
          id: response.quote_id,
          version: 1,
          search: input,
          nights: nightsBetween(input.checkIn, input.checkOut),
          numRooms: response.num_rooms,
          items: [{ roomIndex: 0, occupancy: combinedOccupancy(input), variant, ratePlan, original: rupiah(original), discount: rupiah(response.pricing.discount_minor), subtotal: rupiah(subtotal), taxes: rupiah(response.pricing.tax_minor), service: rupiah(0), total: rupiah(response.pricing.total_price_minor) }],
          original: rupiah(original),
          discount: rupiah(response.pricing.discount_minor),
          subtotal: rupiah(subtotal),
          taxes: rupiah(response.pricing.tax_minor),
          service: rupiah(0),
          total: rupiah(response.pricing.total_price_minor),
          serverTime: response.created_at,
          expiresAt: response.expires_at,
          policySnapshot: { cancellation: response.cancellation_description, payment: 'Pembayaran mengikuti tautan resmi setelah booking dibuat.', noShow: 'Hubungi hotel untuk ketentuan no-show.', chargesIncluded: true },
          nightlyRates: response.nightly_rates?.map(nr => ({ date: nr.date, rate: rupiah(nr.rate_minor) })),
        }
      }
      catch (cause) { throw errorFrom(cause) }
    },

    async createBooking(draft: BookingDraft, idempotencyKey: string): Promise<BookingStatusView> {
      const quote = draft.selectedQuote
      const item = quote?.items[0]
      if (!quote || !item || !draft.search) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Quote booking tidak tersedia.', retryable: false })
      try {
        const response = await $fetch<Omit<BackendCreateBookingResponse, 'guest_access_token'>>('/api/bff/bookings', { method: 'POST', headers: { 'X-Pulang-CSRF': '1', 'Idempotency-Key': idempotencyKey }, body: {
          quote_id: quote.id,
          terms_accepted: draft.consent,
          privacy_accepted: draft.privacyConsent,
          room_type_id: item.variant.id,
          check_in: draft.search.checkIn,
          check_out: draft.search.checkOut,
          num_rooms: draft.search.occupancy.length,
          num_guests: totalGuests(draft.search),
          guest_name: draft.guest.fullName.trim(),
          guest_email: draft.guest.email.trim().toLowerCase(),
          guest_phone: (draft.guest.phone || '').trim(),
          estimated_arrival_time: draft.guest.arrivalTime || '',
          special_requests: draft.guest.specialRequests.trim(),
        } })
        return { id: response.booking.id, reference: response.reference || response.booking.id, status: mapStatus(response.booking.status), serverTime: response.server_time, expiresAt: response.expires_at || response.booking.expires_at || response.server_time, quote, guestName: draft.guest.fullName, paymentUrl: response.payment_url }
      }
      catch (cause) { throw errorFrom(cause) }
    },

    async getBookingStatus(id: string): Promise<BookingStatusView> {
      try {
        const response = await $fetch<{ booking: BackendBooking, payment_url?: string, reference?: string, expires_at?: string, observed_at: string }>(`/api/bff/bookings/${encodeURIComponent(id)}`)
        return { id, reference: response.reference || id, status: mapStatus(response.booking.status), serverTime: response.observed_at, expiresAt: response.expires_at || response.booking.expires_at || response.observed_at, guestName: response.booking.guest_name, paymentUrl: response.payment_url }
      }
      catch (cause) { throw errorFrom(cause) }
    },

    async cancelBooking(id: string): Promise<void> {
      try { await $fetch(`/api/bff/bookings/${encodeURIComponent(id)}/cancel`, { method: 'POST', headers: { 'X-Pulang-CSRF': '1' } }) }
      catch (cause) { throw errorFrom(cause) }
    },
  }
}
