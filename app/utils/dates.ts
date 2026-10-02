import type { DateOnly } from '~/types/booking'

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDateOnly(value: string): { year: number, month: number, day: number } | null {
  const match = DATE_ONLY.exec(value)
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return { year, month, day }
}

export function dateOrdinal(value: DateOnly): number {
  const parsed = parseDateOnly(value)
  if (!parsed) throw new Error(`Invalid DateOnly: ${value}`)
  return Math.floor(Date.UTC(parsed.year, parsed.month - 1, parsed.day) / 86_400_000)
}

export function nightsBetween(checkIn: DateOnly, checkOut: DateOnly): number {
  return dateOrdinal(checkOut) - dateOrdinal(checkIn)
}

export function formatDate(value: DateOnly): string {
  const parsed = parseDateOnly(value)
  if (!parsed) return value
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 6)))
}
