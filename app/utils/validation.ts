import type { GuestDetails, SearchInput } from '~/types/booking'
import { nightsBetween, parseDateOnly } from './dates'

export function validateSearch(input: SearchInput): string[] {
  const errors: string[] = []
  if (!parseDateOnly(input.checkIn) || !parseDateOnly(input.checkOut) || nightsBetween(input.checkIn, input.checkOut) < 1) errors.push('Tanggal check-out harus setelah check-in.')
  if (!input.occupancy.length || input.occupancy.length > 4) errors.push('Pilih 1–4 kamar.')
  for (const room of input.occupancy) {
    if (room.adults < 1 || room.adults > 4) errors.push(`Kamar ${room.roomIndex + 1} memerlukan 1–4 dewasa.`)
    if (room.childrenAges.some(age => !Number.isInteger(age) || age < 0 || age > 17)) errors.push(`Usia anak kamar ${room.roomIndex + 1} tidak valid.`)
  }
  return errors
}

export function validateGuest(guest: GuestDetails): Record<string, string> {
  const errors: Record<string, string> = {}
  if (guest.fullName.trim().length < 2) errors.fullName = 'Masukkan nama lengkap.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) errors.email = 'Masukkan email yang valid.'
  if ([...guest.specialRequests].length > 500) errors.specialRequests = 'Permintaan maksimal 500 karakter.'
  return errors
}
