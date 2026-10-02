import { createMockBookingClient } from '~/services/mock-booking-client'

export function useBookingClient() {
  return createMockBookingClient()
}
