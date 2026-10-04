import { backendRequest, noStore, requiredID, validatedPaymentURL } from '../../../../../utils/bff'

interface PaymentRecoveryResponse {
  booking_id: string
  status: string
  payment_url?: string
  provider_reference?: string
  amount_minor: number
  currency: string
  expires_at?: string
}

export default defineEventHandler(async (event) => {
  noStore(event)
  const id = requiredID(event)
  const recovery = await backendRequest<PaymentRecoveryResponse>(event, `/api/v1/guest/bookings/${encodeURIComponent(id)}/payment`, { guestSession: true })
  return {
    ...recovery,
    payment_url: validatedPaymentURL(event, recovery.payment_url),
  }
})
