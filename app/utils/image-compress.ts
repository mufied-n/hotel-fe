/**
 * Perkecil dan kompres foto di browser sebelum upload (maks sisi panjang 1600px, JPEG).
 * Kualitas diturunkan bertahap sampai ukuran di bawah batas agar muat di limit server/proxy.
 */
export async function compressImage(file: File, maxSide = 1600, maxBytes = 900 * 1024): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  let blob: Blob | null = null
  for (const quality of [0.82, 0.72, 0.62, 0.5]) {
    blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (blob && blob.size <= maxBytes) break
  }
  if (!blob) throw new Error('Foto tidak dapat diproses.')
  return blob
}
