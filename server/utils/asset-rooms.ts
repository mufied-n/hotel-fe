export function isValidAssetPath(path: string | undefined | null): boolean {
  if (!path || typeof path !== 'string') return false
  const trimmed = path.trim()
  if (!trimmed) return false

  // Reject directory traversal or invalid path separators
  if (trimmed.includes('..') || trimmed.startsWith('/') || trimmed.includes('\\')) {
    return false
  }

  // Only allow valid safe filenames/paths (e.g. hero.jpg, bay/1.jpg)
  const safePathRegex = /^[a-zA-Z0-9_\-./]+$/
  if (!safePathRegex.test(trimmed)) {
    return false
  }

  return true
}

export function resolveAssetKey(path: string): string {
  const clean = path.replace(/^\/+/, '')
  return `rooms/${clean}`
}

export function inferContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    default:
      return 'application/octet-stream'
  }
}
