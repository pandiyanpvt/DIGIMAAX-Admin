import apiClient from './client'

export interface SalesSummary {
  daily: {
    totalSoldProducts: number
    totalSales: number
    percentageChangeFromYesterday: number
    salesPercentageChangeFromYesterday: number
  }
  monthly: {
    totalSoldProducts: number
    totalSales: number
    percentageChangeFromLastMonth: number
    salesPercentageChangeFromLastMonth: number
  }
}

export interface SalesGraphData {
  period: {
    start: string
    end: string
  }
  dailySales: Array<{
    date: string
    amount: number
  }>
}

export interface SalesSummaryResponse {
  success: boolean
  data: SalesSummary
  error?: {
    code: string
    message: string
  }
}

export interface SalesGraphResponse {
  success: boolean
  data: SalesGraphData
  error?: {
    code: string
    message: string
  }
}

// Get sales summary (daily and monthly with percentage changes)
export async function getSalesSummary(): Promise<SalesSummary> {
  try {
    const { data } = await apiClient.get<SalesSummaryResponse>('/api/analytics/sales-summary')
    if (data.success && data.data) {
      return data.data
    }
    throw new Error(data.error?.message || 'Failed to fetch sales summary')
  } catch (error: any) {
    console.error('Error fetching sales summary:', error)
    throw error
  }
}

// Get sales graph data (last 30 days)
export async function getSalesGraph(): Promise<SalesGraphData> {
  try {
    const { data } = await apiClient.get<SalesGraphResponse>('/api/analytics/sales-graph')
    if (data.success && data.data) {
      return data.data
    }
    throw new Error(data.error?.message || 'Failed to fetch sales graph')
  } catch (error: any) {
    console.error('Error fetching sales graph:', error)
    throw error
  }
}

