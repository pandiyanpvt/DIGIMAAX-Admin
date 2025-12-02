import apiClient from './client'

export interface UserRole {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserRolePayload {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateUserRolePayload {
  id: number
  name?: string
  description?: string
  is_active?: boolean
}

// Get all user roles (admin only)
export async function getAllUserRoles(): Promise<UserRole[]> {
  try {
    const { data } = await apiClient.get('/api/user-role/getAll')
    // Backend returns { message, count, userRoles }
    if (data?.userRoles && Array.isArray(data.userRoles)) {
      return data.userRoles
    }
    // Fallback for direct array response
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Error fetching user roles:', error)
    throw error
  }
}

// Create user role
export async function createUserRole(payload: CreateUserRolePayload): Promise<UserRole> {
  try {
    const { data } = await apiClient.post('/api/user-role/save', payload)
    return data
  } catch (error: any) {
    console.error('Error creating user role:', error)
    throw error
  }
}

// Update user role
export async function updateUserRole(payload: UpdateUserRolePayload): Promise<UserRole> {
  try {
    const { data } = await apiClient.put(`/api/user-role/update/${payload.id}`, {
      name: payload.name,
      description: payload.description,
      is_active: payload.is_active,
    })
    return data
  } catch (error: any) {
    console.error('Error updating user role:', error)
    throw error
  }
}

// Delete user role
export async function deleteUserRole(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/user-role/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting user role:', error)
    throw error
  }
}

