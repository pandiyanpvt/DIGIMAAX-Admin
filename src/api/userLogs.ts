import apiClient from './client'

export interface UserLog {
  id: number
  user_id: number | null
  email: string
  login_type: string
  ip_address: string | null
  user_agent: string | null
  login_status: string
  failure_reason: string | null
  created_at: string
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
}

export interface UserLogsResponse {
  success: boolean
  message: string
  data: {
    logs: UserLog[]
    pagination: {
      current_page: number
      page_size: number
      total_items: number
      total_pages: number
      has_next_page: boolean
      has_previous_page: boolean
    }
  }
}

export interface GetUserLogsParams {
  page?: number
  pageSize?: number
}

// Get user logs (developer only)
export async function getUserLogs(params?: GetUserLogsParams): Promise<UserLogsResponse['data']> {
  try {
    const { data } = await apiClient.get<UserLogsResponse>('/api/user/logs', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    })
    return data.data
  } catch (error: any) {
    console.error('Error fetching user logs:', error)
    throw error
  }
}

