import { describe, expect, it } from 'vitest'
import { buildUploadKey, isValidVariantSlug, sniffImageType } from '../../server/utils/photo-upload'

describe('photo upload helpers', () => {
  it('detects image type from magic bytes only', () => {
    expect(sniffImageType(new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0, 0]))).toBe('jpg')
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0]))).toBe('png')
    expect(sniffImageType(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 '))).toBe('webp')
    expect(sniffImageType(new TextEncoder().encode('<svg onload=alert(1)>'))).toBeNull()
    expect(sniffImageType(new TextEncoder().encode('GIF89a......'))).toBeNull()
    expect(sniffImageType(new Uint8Array([]))).toBeNull()
  })

  it('accepts only safe variant slugs', () => {
    expect(isValidVariantSlug('deluxe-king-bay')).toBe(true)
    for (const bad of ['', '../x', 'a/b', 'a b', '-x', 'a'.repeat(65), 42, null]) expect(isValidVariantSlug(bad)).toBe(false)
  })

  it('builds an R2 key and a public URL under /asset/rooms', () => {
    expect(buildUploadKey('Suite', 'abc', 'webp')).toEqual({ key: 'rooms/uploads/suite/abc.webp', url: '/asset/rooms/uploads/suite/abc.webp' })
  })
})
