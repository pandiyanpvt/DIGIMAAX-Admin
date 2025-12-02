import apiClient from './client'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  userRoleId: number
  is_verified: boolean
  created_at: string
  updated_at: string
  roleName?: string
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  userRoleId: number
}

export interface UpdateUserPayload {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  userRoleId?: number
}

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data } = await apiClient.get('/api/user/getAll')
    // Backend returns { message, count, users }
    return Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User> {
  try {
    const { data } = await apiClient.get(`/api/user/getByID/${id}`)
    // Backend returns { message, user }
    return data?.user || data
  } catch (error: any) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User> {
  try {
    const { data } = await apiClient.get(`/api/user/getByEmail/${email}`)
    // Backend returns { message, user }
    return data?.user || data
  } catch (error: any) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Get users by role
export async function getUsersByRole(userRoleId: number): Promise<User[]> {
  try {
    const { data } = await apiClient.get(`/api/user/getByUserRole/${userRoleId}`)
    // Backend returns { message, count, users }
    return Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching users by role:', error)
    throw error
  }
}

// Update user
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  try {
    const { data } = await apiClient.put(`/api/user/update/${payload.id}`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      userRoleId: payload.userRoleId,
    })
    return data
  } catch (error: any) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Create user
export async function createUser(payload: CreateUserPayload): Promise<User> {
  try {
    const { data } = await apiClient.post('/api/user/addUser', payload)
    // Backend returns { message, user }
    return data?.user || data
  } catch (error: any) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Delete user
export async function deleteUser(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/user/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<User> {
  try {
    // Get current user ID from localStorage
    const stored = localStorage.getItem('adminAuth')
    if (!stored) {
      throw new Error('User not authenticated')
    }
    const { user } = JSON.parse(stored)
    if (!user?.id) {
      throw new Error('User ID not found')
    }
    
    const { data } = await apiClient.get(`/api/user/getByID/${user.id}`)
    // Backend returns { message, user }
    return data?.user || data
  } catch (error: any) {
    console.error('Error fetching current user profile:', error)
    throw error
  }
}

// Update current user profile
export interface UpdateCurrentUserProfilePayload {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
}

export async function updateCurrentUserProfile(payload: UpdateCurrentUserProfilePayload): Promise<User> {
  try {
    // Get current user ID from localStorage
    const stored = localStorage.getItem('adminAuth')
    if (!stored) {
      throw new Error('User not authenticated')
    }
    const { user } = JSON.parse(stored)
    if (!user?.id) {
      throw new Error('User ID not found')
    }
    
    const { data } = await apiClient.put(`/api/user/update/${user.id}`, payload)
    // Backend returns { message, user }
    const updatedUser = data?.user || data
    
    return updatedUser
  } catch (error: any) {
    console.error('Error updating current user profile:', error)
    throw error
  }
}

