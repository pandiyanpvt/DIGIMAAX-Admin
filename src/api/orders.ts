import apiClient from './client'

export interface Order {
  id: number
  order_number: string
  user_id?: number
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  billing_name: string
  billing_email: string
  billing_phone: string
  billing_address: string
  billing_city: string
  billing_postal: string
  shipping_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_postal?: string
  payment_method: string
  payment_status?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  total_amount: number
  notes?: string
  tracking_number?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_title?: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
  color?: string
  size?: string
  custom_text?: string
  custom_image_url?: string
}

// Get user orders (with optional filters)
export async function getUserOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; pagination?: any }> {
  try {
    const { data } = await apiClient.get('/api/orders', { params })
    // Backend returns { success: true, data: { orders, pagination } }
    if (data?.success && data?.data) {
      return {
        orders: Array.isArray(data.data.orders) ? data.data.orders : [],
        pagination: data.data.pagination
      }
    }
    return { orders: Array.isArray(data) ? data : [] }
  } catch (error: any) {
('Error fetching user orders:', error)
    throw error
  }
}

// Get all orders (admin only)
export async function getAllOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; pagination?: any }> {
  try {
    const { data } = await apiClient.get('/api/orders/all', { params })
    // Backend returns { success: true, data: { orders, pagination } }
    if (data?.success && data?.data) {
      return {
        orders: Array.isArray(data.data.orders) ? data.data.orders : [],
        pagination: data.data.pagination
      }
    }
    return { orders: Array.isArray(data) ? data : [] }
  } catch (error: any) {
('Error fetching orders:', error)
    throw error
  }
}

// Get order by ID
export async function getOrderById(id: number): Promise<Order> {
  try {
    const { data } = await apiClient.get(`/api/orders/${id}`)
    // Backend returns { success: true, data: order }
    return data?.data || data
  } catch (error: any) {
('Error fetching order:', error)
    throw error
  }
}

// Create order
export interface CreateOrderPayload {
  billing_name: string
  billing_email: string
  billing_phone: string
  billing_address: string
  billing_city: string
  billing_postal: string
  shipping_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_postal?: string
  payment_method: string
  notes?: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const { data } = await apiClient.post('/api/orders', payload)
    return data
  } catch (error: any) {
('Error creating order:', error)
    throw error
  }
}

// Update order status (admin only)
export interface UpdateOrderStatusPayload {
  status: Order['status']
  tracking_number?: string
}

export async function updateOrderStatus(id: number, payload: UpdateOrderStatusPayload): Promise<Order> {
  try {
    const { data } = await apiClient.put(`/api/orders/${id}/status`, payload)
    // Backend returns { success: true, data: order }
    return data?.data || data
  } catch (error: any) {
('Error updating order status:', error)
    throw error
  }
}

// Cancel order
export interface CancelOrderPayload {
  reason?: string
}

export async function cancelOrder(id: number, payload?: CancelOrderPayload): Promise<Order> {
  try {
    const { data } = await apiClient.post(`/api/orders/${id}/cancel`, payload || {})
    return data
  } catch (error: any) {
('Error cancelling order:', error)
    throw error
  }
}

