import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { Occupancy, SearchInput } from '~/types/booking'

export function encodeSearch(input: SearchInput): LocationQueryRaw {
  return { v: '1', check_in: input.checkIn, check_out: input.checkOut, guests: input.occupancy.map(room => `${room.adults}:${room.childrenAges.join('.')}`).join(','), ...(input.promoCode ? { promo: input.promoCode } : {}) }
}

export function decodeSearch(query: LocationQuery): SearchInput | null {
  if (query.v !== '1' || typeof query.check_in !== 'string' || typeof query.check_out !== 'string' || typeof query.guests !== 'string' || query.guests.length > 120) return null
  const rooms = query.guests.split(',')
  if (!rooms.length || rooms.length > 4) return null
  const occupancy: Occupancy[] = []
  for (const [roomIndex, encoded] of rooms.entries()) {
    const [adultText, childrenText = ''] = encoded.split(':')
    const adults = Number(adultText)
    const childrenAges = childrenText ? childrenText.split('.').map(Number) : []
    if (!Number.isInteger(adults) || childrenAges.some(age => !Number.isInteger(age))) return null
    occupancy.push({ roomIndex, adults, childrenAges })
  }
  return { checkIn: query.check_in, checkOut: query.check_out, occupancy, promoCode: typeof query.promo === 'string' ? query.promo.slice(0, 30) : undefined, locale: 'id-ID', currency: 'IDR' }
}
