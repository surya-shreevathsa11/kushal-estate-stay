import { useCallback, useState } from 'react'
import { ApiError, requestPublicQuote } from '../services/api.js'

export function useBooking() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submitEnquiry = useCallback(async (payload) => {
    setStatus('loading')
    setMessage('')
    try {
      await requestPublicQuote(payload)
      setStatus('success')
      setMessage('Request received. We will confirm availability shortly.')
      return true
    } catch (err) {
      const offline =
        err instanceof ApiError && (err.status === 0 || err.status >= 500)
      setStatus('error')
      setMessage(
        offline
          ? 'Booking API is not live yet. Please email or call to reserve — details in the footer.'
          : err?.message || 'Could not send your request. Please try again.',
      )
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  return { status, message, submitEnquiry, reset }
}
