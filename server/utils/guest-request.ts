import type { GuestSpecialRequest, GuestSpecialRequestsResponse } from '~~/shared/types/backend'

const categories = new Set(['early_arrival', 'late_departure', 'high_floor', 'quiet_room', 'bed_type', 'celebration_setup', 'baby_crib', 'dietary_allergy', 'other'])

export function guestRequestBody(value: unknown) {
  const source = (value || {}) as Record<string, unknown>
  const category = String(source.category || '')
  const description = String(source.description || '').trim()
  const targetTime = String(source.target_time || '').trim()
  if (!categories.has(category)) throw createError({ statusCode: 400, statusMessage: 'Kategori permintaan tidak valid.' })
  if (!description || description.length > 1000) throw createError({ statusCode: 400, statusMessage: 'Deskripsi wajib diisi dan maksimal 1000 karakter.' })
  if (targetTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(targetTime)) throw createError({ statusCode: 400, statusMessage: 'Waktu target harus berformat HH:mm.' })
  return { category, description, ...(targetTime ? { target_time: targetTime } : {}) }
}

export function mapGuestRequest(item: Record<string, unknown>): GuestSpecialRequest {
  return {
    id: String(item.id || ''), booking_id: String(item.booking_id || ''), category: String(item.category || 'other') as GuestSpecialRequest['category'], department: String(item.department || 'front_desk') as GuestSpecialRequest['department'], description: String(item.description || ''), target_time: item.target_time ? String(item.target_time) : undefined, status: String(item.status || 'pending') as GuestSpecialRequest['status'], staff_notes: item.staff_notes ? String(item.staff_notes) : undefined, created_at: String(item.created_at || ''), updated_at: String(item.updated_at || ''),
  }
}

export function mapGuestRequestList(source: { booking_id: unknown, requests?: Array<Record<string, unknown>> }): GuestSpecialRequestsResponse {
  return { booking_id: String(source.booking_id || ''), requests: (source.requests || []).map(mapGuestRequest) }
}
