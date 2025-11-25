import apiClient from './client'

export interface ContactMessage {
  id: number
  fullName: string
  emailAddress: string
  phoneNumber: string
  serviceInterest?: string
  subject?: string
  message?: string
  created_at: string
  updated_at: string
}

export interface CreateContactPayload {
  fullName: string
  emailAddress: string
  phoneNumber?: string
  serviceInterest?: string
  message: string
}

// Get all contact messages (admin only)
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data } = await apiClient.get('/api/contact/getAll')
    // Backend returns { message, count, contacts }
    return Array.isArray(data?.contacts) ? data.contacts : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching contact messages:', error)
    throw error
  }
}

// Get contact message by ID
export async function getContactMessageById(id: number): Promise<ContactMessage> {
  try {
    const { data } = await apiClient.get(`/api/contact/getByID/${id}`)
    // Backend returns { message, contact }
    return data?.contact || data
  } catch (error: any) {
    console.error('Error fetching contact message:', error)
    throw error
  }
}

// Create contact message
export async function createContactMessage(payload: CreateContactPayload): Promise<ContactMessage> {
  try {
    const { data } = await apiClient.post('/api/contact/save', payload)
    // Backend returns { message, contact }
    return data?.contact || data
  } catch (error: any) {
    console.error('Error creating contact message:', error)
    throw error
  }
}

// Get contact messages by email
export async function getContactMessagesByEmail(email: string): Promise<ContactMessage[]> {
  try {
    const { data } = await apiClient.get(`/api/contact/getByEmailAddress/${email}`)
    // Backend returns { message, count, contacts }
    return Array.isArray(data?.contacts) ? data.contacts : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching contact messages:', error)
    throw error
  }
}

// Get contact messages by service interest
export async function getContactMessagesByServiceInterest(serviceInterest: string): Promise<ContactMessage[]> {
  try {
    const { data } = await apiClient.get(`/api/contact/getByServiceInterest/${serviceInterest}`)
    // Backend returns { message, count, contacts }
    return Array.isArray(data?.contacts) ? data.contacts : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching contact messages by service interest:', error)
    throw error
  }
}

// Get contact messages by full name
export async function getContactMessagesByFullName(fullName: string): Promise<ContactMessage[]> {
  try {
    const { data } = await apiClient.get(`/api/contact/getByFullName/${fullName}`)
    // Backend returns { message, count, contacts }
    return Array.isArray(data?.contacts) ? data.contacts : (Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Error fetching contact messages by full name:', error)
    throw error
  }
}

// Update contact message (admin only)
export async function updateContactMessage(id: number, payload: Partial<ContactMessage>): Promise<ContactMessage> {
  try {
    const { data } = await apiClient.put(`/api/contact/update/${id}`, payload)
    // Backend returns { message, contact }
    return data?.contact || data
  } catch (error: any) {
    console.error('Error updating contact message:', error)
    throw error
  }
}

// Delete contact message (admin only)
export async function deleteContactMessage(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/contact/delete/${id}`)
  } catch (error: any) {
    console.error('Error deleting contact message:', error)
    throw error
  }
}

