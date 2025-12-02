import apiClient from './client'

export interface Payment {
  id: number
  order_id: number
  amount: number
  payment_method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  payment_id?: string
  created_at: string
  updated_at: string
}

export interface CreatePaymentPayload {
  order_id: number
  payment_method: string
  amount: number
}

export interface ProcessRefundPayload {
  refund_amount: number
  reason?: string
}

// Create payment
export async function createPayment(payload: CreatePaymentPayload): Promise<Payment> {
  try {
    const { data } = await apiClient.post('/api/payments', payload)
    return data
  } catch (error: any) {
('Error creating payment:', error)
    throw error
  }
}

// Get payment by ID
export async function getPaymentById(id: number): Promise<Payment> {
  try {
    const { data } = await apiClient.get(`/api/payments/${id}`)
    return data
  } catch (error: any) {
('Error fetching payment:', error)
    throw error
  }
}

// Process refund (admin only)
export async function processRefund(paymentId: number, payload: ProcessRefundPayload): Promise<Payment> {
  try {
    const { data } = await apiClient.post(`/api/payments/${paymentId}/refund`, payload)
    return data
  } catch (error: any) {
('Error processing refund:', error)
    throw error
  }
}

