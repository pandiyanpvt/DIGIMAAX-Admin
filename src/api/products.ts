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
  badge?: string
  image?: File // Primary image (single file)
  images?: File[] // Additional images (multiple files, max 10)
}

export interface UpdateProductPayload {
  id: number
  title?: string
  category_id?: number
  price?: number
  short_desc?: string
  description?: string
  badge?: string
  in_stock?: boolean
  stock_quantity?: number
  is_featured?: boolean
  is_active?: boolean
  // Note: image and images fields removed - use separate APIs for image changes
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
    
    // Always send these fields with defaults if not provided
    formData.append('short_desc', payload.short_desc || payload.title)
    if (payload.description) {
      formData.append('description', payload.description)
    }
    if (payload.badge) {
      formData.append('badge', payload.badge)
    }
    formData.append('in_stock', (payload.in_stock !== undefined ? payload.in_stock : true) ? 'true' : 'false')
    formData.append('stock_quantity', (payload.stock_quantity !== undefined ? payload.stock_quantity : 0).toString())
    formData.append('is_featured', (payload.is_featured !== undefined ? payload.is_featured : false) ? 'true' : 'false')
    
    if (payload.image) {
      formData.append('image', payload.image)
    }
    
    // Additional images (multiple files)
    if (payload.images && Array.isArray(payload.images)) {
      payload.images.forEach((file) => {
        formData.append('images', file)
      })
    }

    // Log all FormData entries
    console.log('FormData entries:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, `(File, ${value.size} bytes)`)
      } else {
        console.log(`${key}:`, value)
      }
    }

    const { data } = await apiClient.post('/api/products', formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error creating product:', error)
    console.error('Response data:', error?.response?.data)
    throw error
  }
}

// Update product (text fields only, no images)
export async function updateProduct(payload: UpdateProductPayload): Promise<Product> {
  try {
    // Update API now only accepts JSON, no file uploads
    const updateData: any = {}
    
    // Required fields
    if (payload.title) updateData.title = payload.title
    if (payload.price !== undefined) updateData.price = payload.price
    
    // Optional fields - only send if provided
    if (payload.category_id !== undefined) updateData.category_id = payload.category_id
    if (payload.short_desc !== undefined) updateData.short_desc = payload.short_desc
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.badge !== undefined) updateData.badge = payload.badge
    if (payload.in_stock !== undefined) updateData.in_stock = payload.in_stock
    if (payload.stock_quantity !== undefined) updateData.stock_quantity = payload.stock_quantity
    if (payload.is_featured !== undefined) updateData.is_featured = payload.is_featured
    if (payload.is_active !== undefined) updateData.is_active = payload.is_active

    const { data } = await apiClient.put(`/api/products/${payload.id}`, updateData)
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error updating product:', error)
    console.error('Response data:', error?.response?.data)
    throw error
  }
}

// Change primary image
export async function changePrimaryImage(productId: number, image: File): Promise<Product> {
  try {
    const formData = new FormData()
    formData.append('image', image)

    const { data } = await apiClient.put(`/api/products/${productId}/primary-image`, formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error changing primary image:', error)
    throw error
  }
}

// Add additional images
export async function addAdditionalImages(productId: number, images: File[]): Promise<Product> {
  try {
    const formData = new FormData()
    images.forEach((file) => {
      formData.append('images', file)
    })

    const { data } = await apiClient.post(`/api/products/${productId}/additional-images`, formData, {
      headers: {
        'Content-Type': undefined as any,
      },
    })
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data
  } catch (error: any) {
    console.error('Error adding additional images:', error)
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

// Delete product image
export async function deleteProductImage(imageId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/products/images/${imageId}`)
  } catch (error: any) {
    console.error('Error deleting product image:', error)
    throw error
  }
}

