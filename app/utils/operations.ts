import type { CleanlinessStatus } from '~/types/operations'

export const cleanlinessLabels: Record<CleanlinessStatus, string> = {
  vacant_dirty: 'Kotor', cleaning: 'Sedang dibersihkan', vacant_clean: 'Bersih', inspected: 'Siap dihuni', occupied: 'Terisi', out_of_service: 'Tidak digunakan', out_of_order: 'Rusak berat',
}
export const shiftLabels = { morning: 'Pagi', afternoon: 'Sore', night: 'Malam' } as const
export const reasonLabels = { maintenance_defect: 'Kerusakan', noise_complaint: 'Keluhan kebisingan', upgrade: 'Upgrade', guest_request: 'Permintaan tamu' } as const
export function jakartaDate() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()) }
export function operationsMessage(cause: unknown, fallback: string) { const value = cause as { message?: string, statusMessage?: string, data?: { statusMessage?: string } }; return value.data?.statusMessage || value.statusMessage || value.message || fallback }
