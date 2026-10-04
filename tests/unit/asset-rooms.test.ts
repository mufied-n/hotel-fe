import { describe, expect, it } from 'vitest'
import { inferContentType, isValidAssetPath, resolveAssetKey } from '../../server/utils/asset-rooms'

describe('asset-rooms utility', () => {
  it('validates safe asset paths and rejects directory traversal or dangerous inputs', () => {
    expect(isValidAssetPath('hero.jpg')).toBe(true)
    expect(isValidAssetPath('bay/1.jpg')).toBe(true)
    expect(isValidAssetPath('suite/6.jpg')).toBe(true)

    // Rejections
    expect(isValidAssetPath('')).toBe(false)
    expect(isValidAssetPath(null as unknown as string)).toBe(false)
    expect(isValidAssetPath(undefined as unknown as string)).toBe(false)
    expect(isValidAssetPath('../hero.jpg')).toBe(false)
    expect(isValidAssetPath('bay/../../secret')).toBe(false)
    expect(isValidAssetPath('/bay/1.jpg')).toBe(false)
    expect(isValidAssetPath('bay\\1.jpg')).toBe(false)
    expect(isValidAssetPath('bay/1.jpg;rm -rf /')).toBe(false)
    expect(isValidAssetPath('bay/<script>alert(1)</script>')).toBe(false)
  })

  it('resolves correct S3 / R2 storage keys', () => {
    expect(resolveAssetKey('hero.jpg')).toBe('rooms/hero.jpg')
    expect(resolveAssetKey('bay/1.jpg')).toBe('rooms/bay/1.jpg')
    expect(resolveAssetKey('balcony/4.jpg')).toBe('rooms/balcony/4.jpg')
  })

  it('infers proper MIME types based on file extensions', () => {
    expect(inferContentType('hero.jpg')).toBe('image/jpeg')
    expect(inferContentType('hero.jpeg')).toBe('image/jpeg')
    expect(inferContentType('image.png')).toBe('image/png')
    expect(inferContentType('photo.webp')).toBe('image/webp')
    expect(inferContentType('photo.avif')).toBe('image/avif')
    expect(inferContentType('unknown.bin')).toBe('application/octet-stream')
  })
})
