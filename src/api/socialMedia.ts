import apiClient from './client'

export interface SocialMediaLink {
  id: number
  social_media: string
  link: string
  is_active?: boolean
  created_at: string
  updated_at: string
}

export interface CreateSocialMediaPayload {
  social_media: string
  link: string
  is_active?: boolean
}

export interface UpdateSocialMediaPayload {
  id: number
  social_media?: string
  link?: string
  is_active?: boolean
}

// Get all social media links
export async function getAllSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const { data } = await apiClient.get('/api/social-media/getAll')
    // Backend returns { message, count, socialMediaLinks }
    return Array.isArray(data?.socialMediaLinks) ? data.socialMediaLinks : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching social media links:', error)
    throw error
  }
}

// Get social media link by ID
export async function getSocialMediaLinkById(id: number): Promise<SocialMediaLink> {
  try {
    const { data } = await apiClient.get(`/api/social-media/getByID/${id}`)
    // Backend returns { message, socialMediaLink }
    return data?.socialMediaLink || data
  } catch (error: any) {
    console.error('Error fetching social media link:', error)
    throw error
  }
}

// Get social media link by social media type
export async function getSocialMediaLinkByType(socialMedia: string): Promise<SocialMediaLink[]> {
  try {
    const { data } = await apiClient.get(`/api/social-media/getBySocialMedia/${socialMedia}`)
    // Backend returns { message, count, socialMediaLinks }
    return Array.isArray(data?.socialMediaLinks) ? data.socialMediaLinks : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching social media link by type:', error)
    throw error
  }
}

// Create social media link
export async function createSocialMediaLink(payload: CreateSocialMediaPayload): Promise<SocialMediaLink> {
  try {
    const { data } = await apiClient.post('/api/social-media/save', payload)
    // Backend returns { message, socialMediaLink }
    return data?.socialMediaLink || data
  } catch (error: any) {
    console.error('Error creating social media link:', error)
    throw error
  }
}

// Update social media link
export async function updateSocialMediaLink(payload: UpdateSocialMediaPayload): Promise<SocialMediaLink> {
  try {
    const { data } = await apiClient.put(`/api/social-media/update/${payload.id}`, {
      social_media: payload.social_media,
      link: payload.link,
      is_active: payload.is_active,
    })
    // Backend returns { message, socialMediaLink }
    return data?.socialMediaLink || data
  } catch (error: any) {
    console.error('Error updating social media link:', error)
    throw error
  }
}

// Delete social media link
export async function deleteSocialMediaLink(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/social-media/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting social media link:', error)
    throw error
  }
}

