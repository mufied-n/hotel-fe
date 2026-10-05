import type { ApiError, BookingDraft, BookingStatusView, Quote, SearchInput, SearchResult } from '~/types/booking'

export class BookingClientError extends Error {
  details: ApiError
  constructor(details: ApiError) {
    super(details.message)
    this.name = 'BookingClientError'
    this.details = details
  }
}

export interface QuoteSelection { variantIds: string[], ratePlanIds: string[] }

export interface BookingClient {
  search(input: SearchInput, scenario?: string): Promise<SearchResult>
  quote(input: SearchInput, selection: QuoteSelection): Promise<Quote>
  createBooking(draft: BookingDraft, idempotencyKey: string): Promise<BookingStatusView>
  getBookingStatus(id: string, scenario?: string): Promise<BookingStatusView>
  cancelBooking(id: string): Promise<void>
  simulatePay?(id: string): Promise<void>
}
