import apiClient from './client'

export interface HeaderImage {
  id: number
  img_url: string
  order_no: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateHeaderImagePayload {
  image: File
  order_no: number
  is_active?: boolean
}

export interface UpdateHeaderImagePayload {
  id: number
  image?: File
  order_no?: number
  is_active?: boolean
}

// Get all header images
export async function getAllHeaderImages(): Promise<HeaderImage[]> {
  try {
    const { data } = await apiClient.get('/api/header-images/getAll')
    // Backend returns { message, count, headerImages }
    return Array.isArray(data?.headerImages) ? data.headerImages : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching header images:', error)
    throw error
  }
}

// Get header image by ID
export async function getHeaderImageById(id: number): Promise<HeaderImage> {
  try {
    const { data } = await apiClient.get(`/api/header-images/getByID/${id}`)
    // Backend returns { message, headerImage }
    return data?.headerImage || data
  } catch (error: any) {
    console.error('Error fetching header image:', error)
    throw error
  }
}

// Get header images by order range
export async function getHeaderImagesByOrder(min: number, max: number): Promise<HeaderImage[]> {
  try {
    const { data } = await apiClient.get(`/api/header-images/getByOrder?min=${min}&max=${max}`)
    // Backend returns { message, count, headerImages }
    return Array.isArray(data?.headerImages) ? data.headerImages : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching header images:', error)
    throw error
  }
}

// Create header image
export async function createHeaderImage(payload: CreateHeaderImagePayload): Promise<HeaderImage> {
  try {
    const formData = new FormData()
    formData.append('image', payload.image)
    formData.append('order_no', payload.order_no.toString())
    formData.append('is_active', payload.is_active ? 'true' : 'false')

    const { data } = await apiClient.post('/api/header-images/save', formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { message, headerImage }
    return data?.headerImage || data
  } catch (error: any) {
    console.error('Error creating header image:', error)
    throw error
  }
}

// Update header image
export async function updateHeaderImage(payload: UpdateHeaderImagePayload): Promise<HeaderImage> {
  try {
    const formData = new FormData()
    if (payload.image) formData.append('image', payload.image)
    if (payload.order_no !== undefined) formData.append('order_no', payload.order_no.toString())
    if (payload.is_active !== undefined) formData.append('is_active', payload.is_active ? 'true' : 'false')

    const { data } = await apiClient.put(`/api/header-images/update/${payload.id}`, formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { message, headerImage }
    return data?.headerImage || data
  } catch (error: any) {
    console.error('Error updating header image:', error)
    throw error
  }
}

// Delete header image
export async function deleteHeaderImage(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/header-images/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting header image:', error)
    throw error
  }
}

// Get header image by order number
export async function getHeaderImageByOrderNo(orderNo: number): Promise<HeaderImage> {
  try {
    const { data } = await apiClient.get(`/api/header-images/getByOrderNo/${orderNo}`)
    return data
  } catch (error: any) {
    console.error('Error fetching header image by order number:', error)
    throw error
  }
}

// Upload header image only (returns URL)
export async function uploadHeaderImage(image: File): Promise<{ url: string; public_id?: string; width?: number; height?: number }> {
  try {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await apiClient.post('/api/header-images/upload', formData, {
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
    console.error('Error uploading header image:', error)
    throw error
  }
}

