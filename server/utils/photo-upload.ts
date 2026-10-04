export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export type UploadImageType = 'jpg' | 'png' | 'webp'

const MIME: Record<UploadImageType, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }

/** Deteksi tipe gambar dari magic bytes, bukan dari nama file atau Content-Type klien. */
export function sniffImageType(bytes: Uint8Array): UploadImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'jpg'
  if (bytes.length >= 8 && [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A].every((b, i) => bytes[i] === b)) return 'png'
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') return 'webp'
  return null
}

export function mimeFor(type: UploadImageType) { return MIME[type] }

export function isValidVariantSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/i.test(value)
}

/** Key objek R2 acak per upload; URL publiknya lewat route /asset/rooms/*. */
export function buildUploadKey(variant: string, id: string, type: UploadImageType) {
  const path = `uploads/${variant.toLowerCase()}/${id}.${type}`
  return { key: `rooms/${path}`, url: `/asset/rooms/${path}` }
}
