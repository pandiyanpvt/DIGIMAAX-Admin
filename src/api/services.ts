import apiClient from './client'

export interface ServicePoint {
  id: number
  service_id: number
  point: string
  point_french?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  name: string
  name_french?: string
  img_url: string
  points?: ServicePoint[]
  created_at: string
  updated_at: string
}

export interface CreateServicePayload {
  image: File
  name: string
  name_french?: string
  points: Array<{ point: string; point_french?: string }>
}

export interface UpdateServicePayload {
  id: number
  name?: string
  name_french?: string
}

export interface UpdateServicePointPayload {
  pointId: number
  point?: string
  point_french?: string
}

export interface SaveServicePointPayload {
  service_id: number
  point: string
  point_french?: string
}

// Get all services
export async function getAllServices(): Promise<Service[]> {
  try {
    const { data } = await apiClient.get('/api/services/getAll')
    // Backend returns { success: true, message, count, data: [...] }
    if (data?.success && Array.isArray(data.data)) {
      return data.data
    }
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Error fetching services:', error)
    throw error
  }
}

// Get service by ID
export async function getServiceById(id: number): Promise<Service> {
  try {
    const { data } = await apiClient.get(`/api/services/getByID/${id}`)
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error fetching service:', error)
    throw error
  }
}

// Create service
export async function createService(payload: CreateServicePayload): Promise<Service> {
  try {
    const formData = new FormData()
    formData.append('image', payload.image)
    formData.append('name', payload.name)
    if (payload.name_french) {
      formData.append('name_french', payload.name_french)
    }
    // Points should be sent as JSON string
    if (payload.points && payload.points.length > 0) {
      formData.append('points', JSON.stringify(payload.points))
    }

    const { data } = await apiClient.post('/api/services/save', formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error creating service:', error)
    throw error
  }
}

// Update service (name and name_french only)
export async function updateService(payload: UpdateServicePayload): Promise<Service> {
  try {
    const { id, ...updateData } = payload
    const { data } = await apiClient.put(`/api/services/update/${id}`, updateData)
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error updating service:', error)
    throw error
  }
}

// Update service image
export async function updateServiceImage(serviceId: number, image: File): Promise<Service> {
  try {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await apiClient.put(`/api/services/updateImage/${serviceId}`, formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error updating service image:', error)
    throw error
  }
}

// Update service point
export async function updateServicePoint(payload: UpdateServicePointPayload): Promise<ServicePoint> {
  try {
    const { pointId, ...updateData } = payload
    const { data } = await apiClient.put(`/api/services/updatePoint/${pointId}`, updateData)
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error updating service point:', error)
    throw error
  }
}

// Save new service point
export async function saveServicePoint(payload: SaveServicePointPayload): Promise<ServicePoint> {
  try {
    const { data } = await apiClient.post('/api/services/savePoint', payload)
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error saving service point:', error)
    throw error
  }
}

// Delete service point
export async function deleteServicePoint(pointId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/services/deletePoint/${pointId}`)
  } catch (error: any) {
    console.error('Error deleting service point:', error)
    throw error
  }
}

// Delete service
export async function deleteService(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/services/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting service:', error)
    throw error
  }
}

