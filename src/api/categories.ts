import apiClient from './client'

export interface ProductCategory {
  id: number
  name: string
  is_active?: boolean | number
  product_count?: number
  customization_color?: boolean | number
  customization_size?: boolean | number
  customization_text?: boolean | number
  customization_image?: boolean | number
  created_at: string
  updated_at: string
}

export interface CreateCategoryPayload {
  name: string
  is_active?: boolean
  customization_color?: boolean
  customization_size?: boolean
  customization_text?: boolean
  customization_image?: boolean
}

export interface UpdateCategoryPayload {
  id: number
  name?: string
  is_active?: boolean
  customization_color?: boolean
  customization_size?: boolean
  customization_text?: boolean
  customization_image?: boolean
}

// Get all categories
export async function getAllCategories(): Promise<ProductCategory[]> {
  try {
    const { data } = await apiClient.get('/api/categories')
    // Backend returns { success: true, data: [...] }
    if (data?.success && Array.isArray(data.data)) {
      return data.data
    }
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    throw error
  }
}

// Get category by ID
export async function getCategoryById(id: number): Promise<ProductCategory> {
  try {
    const { data } = await apiClient.get(`/api/categories/${id}`)
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    throw error
  }
}

// Create category
export async function createCategory(payload: CreateCategoryPayload): Promise<ProductCategory> {
  try {
    const { data } = await apiClient.post('/api/categories', payload)
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    throw error
  }
}

// Update category
export async function updateCategory(payload: UpdateCategoryPayload): Promise<ProductCategory> {
  try {
    const { id, ...updateData } = payload
    const { data } = await apiClient.put(`/api/categories/${id}`, updateData)
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    throw error
  }
}

// Delete category
export async function deleteCategory(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/categories/${id}`)
  } catch (error: any) {
    throw error
  }
}

