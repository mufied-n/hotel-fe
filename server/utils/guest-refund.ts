import type { GuestRefundStatus } from '~~/shared/types/backend'

export function mapGuestRefundStatus(source: { booking_id: unknown, has_refund: unknown, refunds?: Array<Record<string, unknown>> }): GuestRefundStatus {
  return {
    booking_id: String(source.booking_id || ''),
    has_refund: source.has_refund === true,
    refunds: (source.refunds || []).map((item) => {
      const amount = Number(item.amount_minor)
      if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid refund amount from upstream')
      return {
        id: String(item.id || ''), amount_minor: amount, currency: String(item.currency || 'IDR'), reason: String(item.reason || ''), status: String(item.status || 'unknown'), created_at: String(item.created_at || ''), updated_at: item.updated_at ? String(item.updated_at) : undefined,
      }
    }),
  }
}
