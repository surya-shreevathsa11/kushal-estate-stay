import { useCallback, useEffect, useState } from 'react'
import {
  clearGuestToken,
  decodeGoogleCredentialProfile,
  exchangeGoogleCredential,
  extractGuestAuthToken,
  extractGuestProfile,
  getGuestProfile,
  getGuestToken,
  setGuestProfile,
  setGuestToken,
} from '../services/api.js'

function mergeProfiles(...parts) {
  const out = {}
  for (const part of parts) {
    if (!part || typeof part !== 'object') continue
    if (part.name) out.name = part.name
    if (part.email) out.email = part.email
    if (part.picture) out.picture = part.picture
  }
  return out
}

export function useGuestAuth() {
  const [token, setToken] = useState(() => getGuestToken())
  const [profile, setProfile] = useState(() => getGuestProfile())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const sync = () => {
      setToken(getGuestToken())
      setProfile(getGuestProfile())
    }
    window.addEventListener('guest-auth-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('guest-auth-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const signInWithGoogle = useCallback(async (credential) => {
    setBusy(true)
    setError(null)
    try {
      const data = await exchangeGoogleCredential(credential)
      const next = extractGuestAuthToken(data)
      if (!next) throw new Error('No session token returned.')
      const nextProfile = mergeProfiles(
        decodeGoogleCredentialProfile(credential),
        extractGuestProfile(data),
      )
      setGuestToken(next)
      if (nextProfile.name || nextProfile.email || nextProfile.picture) {
        setGuestProfile(nextProfile)
        setProfile(nextProfile)
      }
      setToken(next)
      window.dispatchEvent(new Event('guest-auth-changed'))
      return true
    } catch (err) {
      setError(err?.message || 'Google sign-in failed.')
      return false
    } finally {
      setBusy(false)
    }
  }, [])

  const signOut = useCallback(() => {
    clearGuestToken()
    setToken(null)
    setProfile(null)
    window.dispatchEvent(new Event('guest-auth-changed'))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    token,
    profile,
    isSignedIn: Boolean(token),
    signedIn: Boolean(token),
    busy,
    error,
    clearError,
    signInWithGoogle,
    signOut,
  }
}
