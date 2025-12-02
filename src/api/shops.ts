import apiClient from './client'

export interface Shop {
  id: number
  name: string
  logo_url?: string
  phone_number?: string
  email_address?: string
  address?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateShopPayload {
  name: string
  logo_url?: string
  phone_number?: string
  email_address?: string
  address?: string
  is_active?: boolean
}

export interface UpdateShopPayload {
  id: number
  name?: string
  logo_url?: string
  phone_number?: string
  email_address?: string
  address?: string
  is_active?: boolean
}

// Get all shops
export async function getAllShops(): Promise<Shop[]> {
  try {
    const { data } = await apiClient.get('/api/shops/getAll')
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Error fetching shops:', error)
    throw error
  }
}

// Get shop by ID
export async function getShopById(id: number): Promise<Shop> {
  try {
    const { data } = await apiClient.get(`/api/shops/getByID/${id}`)
    return data
  } catch (error: any) {
    console.error('Error fetching shop:', error)
    throw error
  }
}

// Create shop
export async function createShop(payload: CreateShopPayload): Promise<Shop> {
  try {
    const { data } = await apiClient.post('/api/shops/save', payload)
    return data
  } catch (error: any) {
    console.error('Error creating shop:', error)
    throw error
  }
}

// Update shop
export async function updateShop(payload: UpdateShopPayload): Promise<Shop> {
  try {
    const { data } = await apiClient.put(`/api/shops/update/${payload.id}`, {
      name: payload.name,
      logo_url: payload.logo_url,
      phone_number: payload.phone_number,
      email_address: payload.email_address,
      address: payload.address,
      is_active: payload.is_active,
    })
    return data
  } catch (error: any) {
    console.error('Error updating shop:', error)
    throw error
  }
}

// Delete shop
export async function deleteShop(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/shops/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting shop:', error)
    throw error
  }
}

