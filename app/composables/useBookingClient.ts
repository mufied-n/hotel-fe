import { createMockBookingClient } from '~/services/mock-booking-client'
import { createApiBookingClient } from '~/services/api-booking-client'

export function useBookingClient() {
  return useRuntimeConfig().public.bookingMode === 'api' ? createApiBookingClient() : createMockBookingClient()
}
