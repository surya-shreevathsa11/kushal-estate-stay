/**
 * Vara guest auth API - Google credential exchange and Bearer-backed guest API calls.
 *
 * Endpoints:
 * - POST /api/guest-auth/google
 * - Authorized guest routes with Authorization: Bearer <token>
 */

/// <reference types="vite/client" />

export const GUEST_TOKEN_KEY = 'kushal_guest_token'
export const GUEST_PROFILE_KEY = 'kushal_guest_profile'

const REQUEST_TIMEOUT_MS = 12000

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const viteApiBase = import.meta.env.VITE_API_BASE_URL
// In Vite dev, call same-origin `/api` so the proxy handles CORS to Vara.
export const API_BASE_URL = (
  import.meta.env.DEV
    ? ''
    : viteApiBase === undefined || viteApiBase === null || String(viteApiBase).trim() === ''
      ? 'https://api.varalabs.in'
      : String(viteApiBase)
).replace(/\/$/, '')

export const PROPERTY_SLUG =
  import.meta.env.VITE_PROPERTY_SLUG || 'kushal-estate-stay'

export function getGoogleClientId(): string | undefined {
  const raw =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    import.meta.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    ''
  const id = typeof raw === 'string' ? raw.trim() : ''
  return id || undefined
}

export function extractGuestAuthToken(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const p = payload as Record<string, unknown>
  const nested =
    p.data && typeof p.data === 'object'
      ? (p.data as Record<string, unknown>)
      : null
  return (
    (typeof p.token === 'string' && p.token) ||
    (typeof p.accessToken === 'string' && p.accessToken) ||
    (nested && typeof nested.token === 'string' && nested.token) ||
    (nested && typeof nested.accessToken === 'string' && nested.accessToken) ||
    null
  )
}

export type GuestProfile = {
  name?: string
  email?: string
  picture?: string
}

function pickProfileFields(source: Record<string, unknown> | null): GuestProfile {
  if (!source) return {}
  const guest =
    source.guest && typeof source.guest === 'object'
      ? (source.guest as Record<string, unknown>)
      : null
  const user =
    source.user && typeof source.user === 'object'
      ? (source.user as Record<string, unknown>)
      : null
  const from = guest || user || source
  const name =
    (typeof from.name === 'string' && from.name) ||
    (typeof from.fullName === 'string' && from.fullName) ||
    undefined
  const email = typeof from.email === 'string' ? from.email : undefined
  const picture =
    (typeof from.picture === 'string' && from.picture) ||
    (typeof from.avatar === 'string' && from.avatar) ||
    (typeof from.photoUrl === 'string' && from.photoUrl) ||
    (typeof from.imageUrl === 'string' && from.imageUrl) ||
    undefined
  return { name, email, picture }
}

/** Decode Google ID token payload for display (picture/name). Not a security check. */
export function decodeGoogleCredentialProfile(
  credential: string,
): GuestProfile | null {
  try {
    const part = String(credential).split('.')[1]
    if (!part) return null
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    )
    const json = atob(padded)
    const payload = JSON.parse(json) as Record<string, unknown>
    return pickProfileFields(payload)
  } catch {
    return null
  }
}

export function extractGuestProfile(payload: unknown): GuestProfile {
  if (!payload || typeof payload !== 'object') return {}
  const p = payload as Record<string, unknown>
  const nested =
    p.data && typeof p.data === 'object'
      ? (p.data as Record<string, unknown>)
      : null
  return {
    ...pickProfileFields(p),
    ...pickProfileFields(nested),
  }
}

export function getGuestProfile(): GuestProfile | null {
  try {
    const raw = localStorage.getItem(GUEST_PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GuestProfile
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function setGuestProfile(profile: GuestProfile) {
  try {
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile))
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearGuestProfile() {
  try {
    localStorage.removeItem(GUEST_PROFILE_KEY)
  } catch {
    /* ignore */
  }
}

export function getGuestToken(): string | null {
  try {
    return localStorage.getItem(GUEST_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setGuestToken(token: string) {
  localStorage.setItem(GUEST_TOKEN_KEY, token)
}

export function clearGuestToken() {
  localStorage.removeItem(GUEST_TOKEN_KEY)
  clearGuestProfile()
}

function guestAuthErrorMessage(status: number, data: unknown) {
  const msg =
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
      ? (data as { message: string }).message.trim()
      : null
  if (msg) return msg
  switch (status) {
    case 401:
      return 'Could not verify your Google account. Please try again.'
    case 404:
      return 'This property is not set up on Vara yet. Ask Sathwik to add kushal-estate-stay.'
    case 429:
      return 'Too many sign-in attempts. Please wait and try again.'
    case 503:
      return 'Google sign-in is not available right now. Please try again later.'
    default:
      return 'Request failed. Please try again.'
  }
}

async function parseJsonResponse(response: Response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    })

    const data = await parseJsonResponse(response)

    if (!response.ok) {
      throw new ApiError(
        guestAuthErrorMessage(response.status, data),
        response.status,
        data,
      )
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 408, null)
    }
    if (error instanceof ApiError) throw error
    throw new ApiError(
      'Could not reach the booking API. If you are on localhost, restart the Vite server and try again.',
      0,
      null,
    )
  } finally {
    clearTimeout(timer)
  }
}

export async function guestAuthorizedFetch(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<unknown> {
  return apiFetch(path, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })
}

export function exchangeGoogleCredential(credential: string) {
  return apiFetch('/api/guest-auth/google', {
    method: 'POST',
    body: JSON.stringify({
      propertySlug: PROPERTY_SLUG,
      credential,
    }),
  })
}
