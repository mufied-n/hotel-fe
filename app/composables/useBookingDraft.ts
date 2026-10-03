import type { BookingDraft, GuestDetails, Quote, SearchInput } from '~/types/booking'

const emptyGuest = (): GuestDetails => ({ fullName: '', email: '', phone: '', arrivalTime: '', specialRequests: '' })

export function useBookingDraft() {
  const draft = useState<BookingDraft>('booking-draft', () => ({ search: null, selectedQuote: null, guest: emptyGuest(), consent: false, privacyConsent: false, idempotencyKey: null }))

  function setSearch(search: SearchInput) {
    if (JSON.stringify(draft.value.search) !== JSON.stringify(search)) {
      draft.value.search = search
      draft.value.selectedQuote = null
      draft.value.consent = false
      draft.value.privacyConsent = false
      draft.value.idempotencyKey = null
    }
  }
  function setQuote(quote: Quote) {
    draft.value.selectedQuote = quote
    draft.value.consent = false
    draft.value.privacyConsent = false
    draft.value.idempotencyKey = null
  }
  function reset() {
    draft.value = { search: null, selectedQuote: null, guest: emptyGuest(), consent: false, privacyConsent: false, idempotencyKey: null }
  }
  return { draft, setSearch, setQuote, reset }
}
