/**
 * Helpers for resolving backend-served assets (e.g. `/uploads/...`).
 *
 * We keep this small and framework-agnostic so sections/components can reuse it.
 */
export function getApiBase(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
}

export function getApiOrigin(): string {
  return getApiBase().replace(/\/api\/?$/, '')
}

/**
 * Resolves asset URL coming from API.
 * - Absolute URLs are returned as-is
 * - `/uploads/...` is prefixed with API origin
 * - Everything else is returned as-is (local asset, relative path, etc.)
 */
export function resolveApiAssetUrl(value?: string | null): string {
  const v = String(value || '')
  if (!v) return ''
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  if (v.startsWith('/uploads/')) return `${getApiOrigin()}${v}`
  return v
}

