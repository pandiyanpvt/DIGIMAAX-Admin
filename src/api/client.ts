import axios from 'axios'

const baseURL =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.trim?.() ||
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  'https://digimaax-backend-production.up.railway.app'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

apiClient.interceptors.request.use((config) => {
  try {
    const authData = getAdminAuthToken()
    if (authData?.token) {
      config.headers = config.headers || {}
      ;(config.headers as any).Authorization = `Bearer ${authData.token}`
    }
  } catch {}
  return config
})

// Add response interceptor to handle connection errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Connection errors are handled silently in production
    return Promise.reject(error)
  }
)

export const setAdminAuthToken = (token: string, user: any, rememberMe: boolean = false) => {
  try {
    const authData = { token, user, rememberMe }
    if (rememberMe) {
      // Store in localStorage for persistent login
      localStorage.setItem('adminAuth', JSON.stringify(authData))
    } else {
      // Store in sessionStorage for session-only login
      sessionStorage.setItem('adminAuth', JSON.stringify(authData))
      // Clear localStorage if it exists (in case user unchecks remember me)
      localStorage.removeItem('adminAuth')
    }
  } catch {}
}

export const clearAdminAuthToken = () => {
  try {
    localStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminAuth')
  } catch {}
}

export const getAdminAuthToken = () => {
  try {
    // Check localStorage first (remember me), then sessionStorage
    const stored = localStorage.getItem('adminAuth') || sessionStorage.getItem('adminAuth')
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  } catch {
    return null
  }
}

export default apiClient
