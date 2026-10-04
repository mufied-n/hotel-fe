import { Readable } from 'node:stream'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { setHeader, sendStream } from 'h3'
import { isValidAssetPath, resolveAssetKey, inferContentType } from '~~/server/utils/asset-rooms'

let s3Client: S3Client | null = null

function getR2Client(config: { r2AccountId: string, r2AccessKeyId: string, r2SecretAccessKey: string }) {
  if (!s3Client) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2AccessKeyId,
        secretAccessKey: config.r2SecretAccessKey,
      },
    })
  }
  return s3Client
}

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path || !isValidAssetPath(path)) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter path tidak valid.' })
  }

  const config = useRuntimeConfig()
  const key = resolveAssetKey(path)
  const defaultContentType = inferContentType(path)

  // 1. Coba ambil dari Cloudflare R2 jika kredensial lengkap terkonfigurasi
  if (config.r2AccountId && config.r2AccessKeyId && config.r2SecretAccessKey) {
    try {
      const s3 = getR2Client(config)
      const response = await s3.send(new GetObjectCommand({
        Bucket: config.r2Bucket || 'pulang',
        Key: key,
      }))

      setHeader(event, 'Content-Type', response.ContentType || defaultContentType)
      setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
      if (response.ETag) {
        setHeader(event, 'ETag', response.ETag)
      }
      if (response.ContentLength) {
        setHeader(event, 'Content-Length', response.ContentLength)
      }

      if (response.Body instanceof Readable) {
        return sendStream(event, response.Body)
      }
      else if (response.Body && typeof (response.Body as { transformToByteArray?: () => Promise<Uint8Array> }).transformToByteArray === 'function') {
        const bytes = await (response.Body as { transformToByteArray: () => Promise<Uint8Array> }).transformToByteArray()
        return Buffer.from(bytes)
      }

      return response.Body
    }
    catch {
      // Fallback anggun ke CDN remote jika objek belum ada di R2 atau terjadi error sementara
    }
  }

  // 2. Fallback anggun ke remote resmi jika file belum ada di R2 atau kredensial R2 belum diset
  try {
    const fallbackUrl = `https://pulangkeuttara.com/asset/rooms/${path}`
    const upstream = await $fetch.raw(fallbackUrl, { responseType: 'arrayBuffer' })
    setHeader(event, 'Content-Type', upstream.headers.get('content-type') || defaultContentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return Buffer.from(upstream._data as ArrayBuffer)
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Foto kamar tidak ditemukan.' })
  }
})
