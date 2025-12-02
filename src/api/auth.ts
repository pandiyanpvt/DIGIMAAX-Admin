import apiClient, { clearAdminAuthToken, setAdminAuthToken } from './client'

type AuthResponse = {
  token?: string
  accessToken?: string
  user?: any
  message?: string
}

const persistSession = (data: AuthResponse, rememberMe: boolean = false) => {
  const token = data?.accessToken || data?.token
  if (token) {
    setAdminAuthToken(token, data?.user || null, rememberMe)
  }
  return {
    token: token || null,
    user: data?.user || null,
    message: data?.message,
  }
}


export async function registerAdmin(payload: { firstName: string; lastName: string; email: string; phoneNumber: string; password: string; userRoleId: number }) {
  try {
    const { data } = await apiClient.post('/api/user/register', payload)
    return data?.message || 'Registration successful. Please verify your email.'
  } catch (error: any) {
    throw error
  }
}

export async function loginAdmin(payload: { email: string; password: string }, rememberMe: boolean = false) {
  if (!payload.email || !payload.password) throw new Error('Email and password are required')
  
  try {
    const { data } = await apiClient.post<AuthResponse>('/api/user/adminLogin', payload)
    return persistSession(data || {}, rememberMe)
  } catch (error: any) {
    throw error
  }
}

export async function loginDeveloper(payload: { email: string; password: string }, rememberMe: boolean = false) {
  if (!payload.email || !payload.password) throw new Error('Email and password are required')
  
  try {
    const { data } = await apiClient.post<AuthResponse>('/api/user/developerLogin', payload)
    return persistSession(data || {}, rememberMe)
  } catch (error: any) {
    throw error
  }
}

export async function forgotPassword(email: string) {
  if (!email) throw new Error('Email is required')
  
  try {
    const { data } = await apiClient.post('/api/user/forgot-password', { email })
    return data?.message || 'Password reset OTP sent to your email.'
  } catch (error: any) {
    throw error
  }
}

export async function verifyEmail(payload: { email: string; otp: string }) {
  if (!payload.otp || !payload.email) throw new Error('OTP and email are required')
  
  try {
    const { data } = await apiClient.post('/api/user/verify-email', payload)
    return data?.message || 'Email verified successfully.'
  } catch (error: any) {
    throw error
  }
}

export async function resetPassword(payload: { otp: string; email: string; newPassword: string }) {
  if (!payload.otp || !payload.email || !payload.newPassword) throw new Error('OTP, email, and new password are required')
  
  try {
    const { data } = await apiClient.post('/api/user/reset-password', payload)
    return data?.message || 'Password reset successfully.'
  } catch (error: any) {
    throw error
  }
}

export async function logoutAdmin() {
  // Backend doesn't have a logout endpoint, just clear local storage
  clearAdminAuthToken()
}
