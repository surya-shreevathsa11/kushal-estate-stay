import { useCallback, useEffect, useState } from 'react'
import {
  clearGuestToken,
  exchangeGoogleCredential,
  extractGuestAuthToken,
  getGuestToken,
  setGuestToken,
} from '../services/api.js'

export function useGuestAuth() {
  const [token, setToken] = useState(() => getGuestToken())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const sync = () => setToken(getGuestToken())
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
      setGuestToken(next)
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
    window.dispatchEvent(new Event('guest-auth-changed'))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    token,
    isSignedIn: Boolean(token),
    signedIn: Boolean(token),
    busy,
    error,
    clearError,
    signInWithGoogle,
    signOut,
  }
}
