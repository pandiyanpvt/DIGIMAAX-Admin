import apiClient from './client'

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  custom_text?: string
  product?: {
    id: number
    title: string
    price: number
    image?: string
  }
  created_at: string
  updated_at: string
}

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
  total: number
  created_at: string
  updated_at: string
}

export interface AddToCartPayload {
  product_id: number
  quantity: number
  custom_text?: string
}

export interface UpdateCartItemPayload {
  quantity: number
  custom_text?: string
}

// Get cart (for current user)
export async function getCart(): Promise<Cart> {
  try {
    const { data } = await apiClient.get('/api/cart')
    return data
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

// Get cart by user ID
export async function getCartByUserId(userId: number): Promise<Cart> {
  try {
    const { data } = await apiClient.get(`/api/cart/user/${userId}`)
    return data
  } catch (error: any) {
    console.error('Error fetching cart by user ID:', error)
    throw error
  }
}

// Add item to cart
export async function addToCart(payload: AddToCartPayload): Promise<CartItem> {
  try {
    const { data } = await apiClient.post('/api/cart/items', payload)
    return data
  } catch (error: any) {
    console.error('Error adding item to cart:', error)
    throw error
  }
}

// Update cart item
export async function updateCartItem(itemId: number, payload: UpdateCartItemPayload): Promise<CartItem> {
  try {
    const { data } = await apiClient.put(`/api/cart/items/${itemId}`, payload)
    return data
  } catch (error: any) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

// Remove item from cart
export async function removeCartItem(itemId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/cart/items/${itemId}`)
  } catch (error: any) {
    console.error('Error removing cart item:', error)
    throw error
  }
}

// Clear cart
export async function clearCart(): Promise<void> {
  try {
    await apiClient.delete('/api/cart')
  } catch (error: any) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

