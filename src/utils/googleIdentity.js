const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const GIS_SCRIPT_ATTR = 'data-google-gis'

/**
 * Load Google Identity Services once; resolves with window.google.
 */
export function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity requires a browser.'))
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google)
  }

  const existing = document.querySelector(`script[${GIS_SCRIPT_ATTR}]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve(window.google)
        return
      }
      existing.addEventListener('load', () => resolve(window.google), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Could not load Google sign-in.')),
        { once: true },
      )
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.setAttribute(GIS_SCRIPT_ATTR, '1')
    script.onload = () => {
      if (window.google?.accounts?.id) resolve(window.google)
      else reject(new Error('Google sign-in failed to initialize.'))
    }
    script.onerror = () => reject(new Error('Could not load Google sign-in.'))
    document.head.appendChild(script)
  })
}
