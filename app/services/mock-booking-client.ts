import { roomFamilies, roomVariants } from '~/data/rooms'
import { ratePlans } from '~/data/rate-plans'
import { demoTimeAfter, DEMO_SERVER_TIME } from './demo-clock'
import { BookingClientError, type BookingClient, type QuoteSelection } from './booking-client'
import type { BookingDraft, BookingStatus, BookingStatusView, Money, Quote, QuoteItem, SearchInput, SearchResult } from '~/types/booking'
import { money, sumMoney } from '~/utils/money'
import { nightsBetween } from '~/utils/dates'
import { validateSearch } from '~/utils/validation'

const nightlyPrices: Record<string, number> = {
  'deluxe-king-bay': 113150000,
  'deluxe-twin-bay': 113150000,
  'deluxe-king-balcony': 113150000,
  'deluxe-twin-balcony': 113150000,
  'executive-suite': 251850000,
  'suite-room': 281050000,
  'family-suite': 646050000,
}

const pause = () => new Promise(resolve => setTimeout(resolve, import.meta.dev ? 140 : 10))
const statusStore = new Map<string, BookingStatusView>()
const attemptStore = new Map<string, BookingStatusView>()

function prorate(total: number): { subtotal: number, taxes: number, service: number } {
  const taxes = Math.round(total * 10193694 / 113150000)
  const service = Math.round(total * 10286364 / 113150000)
  return { subtotal: total - taxes - service, taxes, service }
}

function aggregate(items: QuoteItem[], key: 'original' | 'discount' | 'subtotal' | 'taxes' | 'service' | 'total'): Money {
  return sumMoney(items.map(item => item[key]))
}

function statusFromScenario(scenario?: string): BookingStatus | null {
  const allowed: BookingStatus[] = ['pending_payment', 'processing', 'confirmed', 'failed', 'expired', 'needs_assistance']
  return allowed.includes(scenario as BookingStatus) ? scenario as BookingStatus : null
}

export function createMockBookingClient(): BookingClient {
  return {
    async search(input: SearchInput, scenario?: string): Promise<SearchResult> {
      await pause()
      const errors = validateSearch(input)
      if (errors.length) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: errors[0]!, retryable: false })
      if (scenario === 'service-error') throw new BookingClientError({ code: 'SERVICE_UNAVAILABLE', message: 'Layanan demo sedang tidak tersedia.', retryable: true })
      if (scenario === 'sold-out') throw new BookingClientError({ code: 'SOLD_OUT', message: 'Tidak ada kamar demo pada tanggal ini. Coba ubah tanggal.', retryable: false })
      return { search: input, rooms: roomFamilies }
    },

    async quote(input: SearchInput, selection: QuoteSelection): Promise<Quote> {
      await pause()
      if (selection.variantIds.length !== input.occupancy.length || selection.ratePlanIds.length !== input.occupancy.length) {
        throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Pilih kamar dan paket untuk setiap kamar.', retryable: false })
      }
      const nights = nightsBetween(input.checkIn, input.checkOut)
      const items = input.occupancy.map((occupancy, roomIndex): QuoteItem => {
        const variant = roomVariants.find(room => room.id === selection.variantIds[roomIndex])
        const ratePlan = ratePlans.find(rate => rate.id === selection.ratePlanIds[roomIndex])
        if (!variant || !ratePlan) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Pilihan kamar atau paket tidak valid.', retryable: false })
        const roomTotal = nightlyPrices[variant.id]! * nights + (ratePlan.breakfast ? 10950000 * nights : 0)
        const originalAmount = Math.round(roomTotal / 0.73)
        const discountAmount = originalAmount - roomTotal
        const split = prorate(roomTotal)
        return { roomIndex, occupancy, variant, ratePlan, original: money(originalAmount), discount: money(discountAmount), subtotal: money(split.subtotal), taxes: money(split.taxes), service: money(split.service), total: money(roomTotal) }
      })
      const quote: Quote = {
        id: `quote-${input.checkIn}-${selection.variantIds.join('-')}`,
        version: input.promoCode?.toUpperCase() === 'OCTOBREAK' ? 2 : 1,
        search: input,
        nights,
        items,
        original: aggregate(items, 'original'),
        discount: aggregate(items, 'discount'),
        subtotal: aggregate(items, 'subtotal'),
        taxes: aggregate(items, 'taxes'),
        service: aggregate(items, 'service'),
        total: aggregate(items, 'total'),
        serverTime: DEMO_SERVER_TIME,
        expiresAt: demoTimeAfter(30),
        policySnapshot: { cancellation: 'Tidak dapat dibatalkan atau diubah.', payment: 'Pembayaran penuh saat booking.', noShow: 'Biaya 100% untuk no-show.', chargesIncluded: true },
      }
      return quote
    },

    async createBooking(draft: BookingDraft, idempotencyKey: string): Promise<BookingStatusView> {
      await pause()
      if (!draft.selectedQuote || !draft.guest.fullName || !draft.guest.email || !draft.consent) throw new BookingClientError({ code: 'VALIDATION_ERROR', message: 'Draft booking belum lengkap.', retryable: false })
      const existing = attemptStore.get(idempotencyKey)
      if (existing) return existing
      const sequence = attemptStore.size + 1
      const id = `demo-${String(sequence).padStart(4, '0')}`
      const result: BookingStatusView = { id, reference: `PULANG-DEMO-${String(sequence).padStart(4, '0')}`, status: 'pending_payment', serverTime: DEMO_SERVER_TIME, expiresAt: demoTimeAfter(30), quote: draft.selectedQuote, guestName: draft.guest.fullName }
      attemptStore.set(idempotencyKey, result)
      statusStore.set(id, result)
      return result
    },

    async getBookingStatus(id: string, scenario?: string): Promise<BookingStatusView> {
      await pause()
      if (scenario === 'offline') throw new BookingClientError({ code: 'SERVICE_UNAVAILABLE', message: 'Status belum dapat diperiksa. Coba lagi tanpa melakukan pembayaran baru.', retryable: true })
      const found = statusStore.get(id)
      if (!found) throw new BookingClientError({ code: 'UNAUTHORIZED', message: 'Booking demo tidak ditemukan dalam sesi ini.', retryable: false })
      return { ...found, status: statusFromScenario(scenario) ?? found.status }
    },

    async cancelBooking(id: string): Promise<void> {
      await pause()
      const found = statusStore.get(id)
      if (!found) throw new BookingClientError({ code: 'UNAUTHORIZED', message: 'Booking demo tidak ditemukan dalam sesi ini.', retryable: false })
      statusStore.set(id, { ...found, status: 'cancelled', paymentUrl: undefined })
    },
  }
}
