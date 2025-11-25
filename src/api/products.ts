import apiClient from './client'

export interface Product {
  id: number
  title: string
  description?: string
  short_desc?: string
  price: number
  primary_image?: string
  images?: Array<{ id: number; image_url: string; is_primary: boolean; sort_order: number }>
  category_id?: number
  category_name?: string
  in_stock: boolean
  stock_quantity?: number
  is_active?: boolean
  is_featured?: boolean
  badge?: string
  rating_total?: number
  rating_count?: number
  public_rating?: number
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
  }
}

export interface CreateProductPayload {
  title: string
  description?: string
  short_desc?: string
  price: number
  category_id: number
  in_stock?: boolean
  stock_quantity?: number
  is_featured?: boolean
  image?: File
  images?: string[] // Array of image URLs
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: number
  is_active?: boolean
}

export interface GetProductsParams {
  category?: number
  search?: string
  name?: string
  min_price?: number
  max_price?: number
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

// Get all products with optional filters
export async function getAllProducts(params?: GetProductsParams): Promise<Product[]> {
  try {
    const { data } = await apiClient.get('/api/products', { params })
    // Backend returns { success: true, data: { products: [...], pagination: {...} } }
    if (data?.success && data?.data?.products) {
      return Array.isArray(data.data.products) ? data.data.products : []
    }
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Get product by ID
export async function getProductById(id: number): Promise<Product> {
  try {
    const { data } = await apiClient.get(`/api/products/${id}`)
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Create product
export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  try {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('price', payload.price.toString())
    formData.append('category_id', payload.category_id.toString())
    
    if (payload.description) formData.append('description', payload.description)
    if (payload.short_desc) formData.append('short_desc', payload.short_desc)
    if (payload.in_stock !== undefined) formData.append('in_stock', payload.in_stock.toString())
    if (payload.stock_quantity !== undefined) formData.append('stock_quantity', payload.stock_quantity.toString())
    if (payload.is_featured !== undefined) formData.append('is_featured', payload.is_featured.toString())
    if (payload.image) formData.append('image', payload.image)
    if (payload.images && Array.isArray(payload.images)) {
      formData.append('images', JSON.stringify(payload.images))
    }

    const { data } = await apiClient.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product
export async function updateProduct(payload: UpdateProductPayload): Promise<Product> {
  try {
    const formData = new FormData()
    
    if (payload.title) formData.append('title', payload.title)
    if (payload.price !== undefined) formData.append('price', payload.price.toString())
    if (payload.category_id !== undefined) formData.append('category_id', payload.category_id.toString())
    if (payload.description !== undefined) formData.append('description', payload.description)
    if (payload.short_desc !== undefined) formData.append('short_desc', payload.short_desc)
    if (payload.in_stock !== undefined) formData.append('in_stock', payload.in_stock.toString())
    if (payload.stock_quantity !== undefined) formData.append('stock_quantity', payload.stock_quantity.toString())
    if (payload.is_featured !== undefined) formData.append('is_featured', payload.is_featured.toString())
    if (payload.image) formData.append('image', payload.image)
    if (payload.images && Array.isArray(payload.images)) {
      formData.append('images', JSON.stringify(payload.images))
    }

    const { data } = await apiClient.put(`/api/products/${payload.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete product
export async function deleteProduct(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/products/${id}`)
  } catch (error: any) {
    console.error('Error deleting product:', error)
    throw error
  }
}

