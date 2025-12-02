import apiClient from './client'

export interface GalleryImage {
  id: number
  name: string
  description?: string
  img_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateGalleryPayload {
  image: File
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateGalleryPayload {
  id: number
  image?: File
  name?: string
  description?: string
  is_active?: boolean
}

// Get all gallery images
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const { data } = await apiClient.get('/api/gallery/getAll')
    // Backend returns { message, count, galleryItems }
    return Array.isArray(data?.galleryItems) ? data.galleryItems : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    throw error
  }
}

// Get gallery image by ID
export async function getGalleryImageById(id: number): Promise<GalleryImage> {
  try {
    const { data } = await apiClient.get(`/api/gallery/getByID/${id}`)
    // Backend returns { message, galleryItem }
    return data?.galleryItem || data
  } catch (error: any) {
    throw error
  }
}

// Create gallery image
export async function createGalleryImage(payload: CreateGalleryPayload): Promise<GalleryImage> {
  try {
    const formData = new FormData()
    formData.append('image', payload.image)
    formData.append('name', payload.name)
    if (payload.description) formData.append('description', payload.description)
    formData.append('is_active', payload.is_active ? 'true' : 'false')

    // Must set Content-Type to undefined to let browser set it with boundary for FormData
    const { data } = await apiClient.post('/api/gallery/save', formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { message, galleryItem }
    return data?.galleryItem || data
  } catch (error: any) {
    throw error
  }
}

// Update gallery image
export async function updateGalleryImage(payload: UpdateGalleryPayload): Promise<GalleryImage> {
  try {
    const formData = new FormData()
    if (payload.image) formData.append('image', payload.image)
    if (payload.name !== undefined) formData.append('name', payload.name)
    if (payload.description !== undefined) formData.append('description', payload.description)
    if (payload.is_active !== undefined) formData.append('is_active', payload.is_active ? 'true' : 'false')

    // Must set Content-Type to undefined to let browser set it with boundary for FormData
    const { data } = await apiClient.put(`/api/gallery/update/${payload.id}`, formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { message, galleryItem }
    return data?.galleryItem || data
  } catch (error: any) {
    throw error
  }
}

// Delete gallery image
export async function deleteGalleryImage(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/gallery/delete/${id}`)
  } catch (error: any) {
    throw error
  }
}

// Upload gallery image only (returns URL)
export async function uploadGalleryImage(image: File): Promise<{ url: string; public_id?: string; width?: number; height?: number }> {
  try {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await apiClient.post('/api/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Backend returns { message, file: { url, public_id, width, height } }
    return {
      url: data?.file?.url || data?.url,
      public_id: data?.file?.public_id,
      width: data?.file?.width,
      height: data?.file?.height,
    }
  } catch (error: any) {
    throw error
  }
}

