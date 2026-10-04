import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { assertMutationRequest, assertRequestBodyLimit, noStore } from '../../../../utils/bff'
import { MAX_UPLOAD_BYTES, buildUploadKey, isValidVariantSlug, mimeFor, sniffImageType } from '../../../../utils/photo-upload'
import { staffRequest, staffSession } from '../../../../utils/staff-session'
import type { BackendStaffPrincipal } from '~~/shared/types/backend'

let client: S3Client | null = null

export default defineEventHandler(async (event) => {
  noStore(event)
  if (useRuntimeConfig(event).public.operationsMode !== 'api') throw createError({ statusCode: 503, statusMessage: 'Upload foto hanya tersedia pada mode live.', data: { code: 'CAPABILITY_DISABLED' } })
  assertMutationRequest(event)
  assertRequestBodyLimit(event, MAX_UPLOAD_BYTES + 64 * 1024)

  // Validasi token ke backend, lalu pastikan perannya boleh mengubah katalog.
  const principal = await staffRequest<BackendStaffPrincipal>(event, '/api/v1/auth/staff/me')
  const session = await staffSession(event)
  await session.update({ token: session.data.token, expiresAt: session.data.expiresAt, principal: { ...session.data.principal, ...principal } })
  if (principal.role !== 'revenue_mgr' && principal.role !== 'gm_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Peran Anda tidak boleh mengubah foto katalog.', data: { code: 'FORBIDDEN' } })
  }

  const config = useRuntimeConfig(event)
  if (!config.r2AccountId || !config.r2AccessKeyId || !config.r2SecretAccessKey) {
    throw createError({ statusCode: 503, statusMessage: 'Penyimpanan foto belum dikonfigurasi.', data: { code: 'STORAGE_NOT_CONFIGURED' } })
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.data)
  const variant = parts?.find(part => part.name === 'variant')?.data.toString('utf8').trim()
  if (!file || !isValidVariantSlug(variant)) throw createError({ statusCode: 400, statusMessage: 'File dan varian wajib diisi.', data: { code: 'INVALID_UPLOAD' } })
  if (file.data.length > MAX_UPLOAD_BYTES) throw createError({ statusCode: 413, statusMessage: 'Ukuran foto maksimal 4 MB.', data: { code: 'FILE_TOO_LARGE' } })
  const type = sniffImageType(file.data)
  if (!type) throw createError({ statusCode: 415, statusMessage: 'Format foto harus JPG, PNG, atau WebP.', data: { code: 'UNSUPPORTED_MEDIA' } })

  client ||= new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.r2AccessKeyId, secretAccessKey: config.r2SecretAccessKey },
  })
  const { key, url } = buildUploadKey(variant, randomUUID(), type)
  try {
    await client.send(new PutObjectCommand({ Bucket: config.r2Bucket || 'pulang', Key: key, Body: file.data, ContentType: mimeFor(type), CacheControl: 'public, max-age=31536000, immutable' }))
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Foto gagal disimpan ke penyimpanan.', data: { code: 'STORAGE_ERROR' } })
  }
  return { url, size: file.data.length, type: mimeFor(type) }
})
