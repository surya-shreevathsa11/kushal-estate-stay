import { useCallback, useState } from 'react'
import {
  clearGuestToken,
  exchangeGoogleCredential,
  extractGuestAuthToken,
  getGuestToken,
  requestGuestPin,
  setGuestToken,
  verifyGuestPin,
} from '../services/api.js'

export function useGuestAuth() {
  const [token, setToken] = useState(() => getGuestToken())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const requestPin = useCallback(async ({ email, name }) => {
    setBusy(true)
    setError(null)
    try {
      await requestGuestPin({ email, name })
      return true
    } catch (err) {
      setError(err?.message || 'Could not send PIN.')
      return false
    } finally {
      setBusy(false)
    }
  }, [])

  const verifyPin = useCallback(async ({ email, pin, name }) => {
    setBusy(true)
    setError(null)
    try {
      const data = await verifyGuestPin({ email, pin, name })
      const next = extractGuestAuthToken(data)
      if (!next) throw new Error('No session token returned.')
      setGuestToken(next)
      setToken(next)
      return true
    } catch (err) {
      setError(err?.message || 'Could not verify PIN.')
      return false
    } finally {
      setBusy(false)
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
  }, [])

  return {
    token,
    isSignedIn: Boolean(token),
    busy,
    error,
    requestPin,
    verifyPin,
    signInWithGoogle,
    signOut,
  }
}
