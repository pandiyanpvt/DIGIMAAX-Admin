import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Switch,
  FormControlLabel,
  Avatar,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as ProductIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  changePrimaryImage,
  addAdditionalImages,
  type Product,
} from '../../api/products'
import { getAllCategories, type ProductCategory } from '../../api/categories'

// Frontend display interface
interface ProductDisplay {
  id: number
  name: string
  title: string
  category: string
  categoryId?: number
  price: number
  stock: number
  imageUrl: string
  allImages?: Array<{ id: number; image_url: string; is_primary: number; sort_order: number }>
  isActive: boolean
  createdAt: string
  shortDesc?: string
  isFeatured?: boolean
  description?: string
  badge?: string
}

// Map backend data to frontend display format
const mapBackendToFrontend = (backendProduct: Product): ProductDisplay => {
  // Find primary image or use first image
  const primaryImage = backendProduct.images?.find((img: any) => img.is_primary === 1 || img.is_primary === true) || backendProduct.images?.[0]
  
  return {
    id: backendProduct.id,
    name: backendProduct.title, // Use title as name for display
    title: backendProduct.title,
    category: backendProduct.category_name || backendProduct.category?.name || 'Uncategorized',
    categoryId: backendProduct.category_id || backendProduct.category?.id,
    price: typeof backendProduct.price === 'string' ? parseFloat(backendProduct.price) : (backendProduct.price || 0),
    stock: backendProduct.stock_quantity ?? 0,
    imageUrl: backendProduct.primary_image || primaryImage?.image_url || '',
    allImages: (backendProduct.images || []).map((img: any) => ({
      id: img.id,
      image_url: img.image_url,
      is_primary: typeof img.is_primary === 'boolean' ? (img.is_primary ? 1 : 0) : (img.is_primary || 0),
      sort_order: img.sort_order || 0,
    })),
    isActive: backendProduct.is_active ?? true,
    createdAt: backendProduct.created_at ? new Date(backendProduct.created_at).toISOString().split('T')[0] : '',
    shortDesc: backendProduct.short_desc || '',
    isFeatured: backendProduct.is_featured ?? false,
  }
}

function Products() {
  const [products, setProducts] = useState<ProductDisplay[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductDisplay | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedAdditionalImages, setSelectedAdditionalImages] = useState<File[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [changePrimaryImageDialogOpen, setChangePrimaryImageDialogOpen] = useState(false)
  const [addAdditionalImagesDialogOpen, setAddAdditionalImagesDialogOpen] = useState(false)
  const [selectedProductForImage, setSelectedProductForImage] = useState<ProductDisplay | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [, setImagesToDelete] = useState<number[]>([])

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch products - note: backend getAll only returns active products by default
        // For admin, we might want all products, but the endpoint filters by is_active = TRUE
        // We'll work with what's available
        const [backendProducts, backendCategories] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ])
        
        const mappedProducts = backendProducts.map(mapBackendToFrontend)
        setProducts(mappedProducts)
        setCategories(backendCategories)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err?.response?.data?.error?.message || err?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedProduct({
      id: 0, // Temporary ID for new product
      name: '',
      title: '',
      category: '',
      categoryId: undefined,
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
      createdAt: '',
      shortDesc: '',
      isFeatured: false,
    })
    setSelectedFile(null)
    setSelectedAdditionalImages([])
    setAddDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleEdit = async (product: ProductDisplay) => {
    try {
      setError(null)
      // Fetch full product details to get all images
      const fullProduct = await getProductById(product.id)
      const mappedProduct = mapBackendToFrontend(fullProduct)
      setSelectedProduct(mappedProduct)
      setSelectedFile(null)
      setSelectedAdditionalImages([])
      setEditDialogOpen(true)
      setSuccessMessage(null)
    } catch (err: any) {
      console.error('Error fetching product details:', err)
      // Fallback to using the product we already have
      setSelectedProduct({ ...product })
      setSelectedFile(null)
      setSelectedAdditionalImages([])
      setEditDialogOpen(true)
      setError(err?.response?.data?.error?.message || 'Failed to load product details')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, imageUrl: previewUrl })
    }
    setSuccessMessage('Primary image selected successfully')
  }

  const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    
    // Combine with existing files
    const combinedFiles = [...selectedAdditionalImages, ...newFiles]
    
    // Validate max 10 images total
    if (combinedFiles.length > 10) {
      setError(`Maximum 10 additional images allowed. You already have ${selectedAdditionalImages.length} image(s) selected.`)
      // Reset the input
      event.target.value = ''
      return
    }

    // Validate total size (max 20MB)
    const totalSize = combinedFiles.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 20 * 1024 * 1024 // 20MB in bytes
    if (totalSize > maxSize) {
      setError('Total size of additional images must not exceed 20MB')
      // Reset the input
      event.target.value = ''
      return
    }

    setSelectedAdditionalImages(combinedFiles)
    setSuccessMessage(`${newFiles.length} additional image(s) added. Total: ${combinedFiles.length}`)
    // Reset the input to allow selecting the same files again if needed
    event.target.value = ''
  }

  const handleSave = async () => {
    if (!selectedProduct) return

    // Validate
    if (!selectedProduct.title.trim()) {
      setError('Product title is required')
      return
    }
    if (!selectedProduct.categoryId) {
      setError('Category is required')
      return
    }
    if (selectedProduct.price <= 0) {
      setError('Price must be greater than 0')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const productPayload: any = {
        title: selectedProduct.title,
        price: selectedProduct.price,
      }

      // Optional fields - only include if they have values
      if (selectedProduct.categoryId) {
        productPayload.category_id = selectedProduct.categoryId
      }
      if (selectedProduct.stock !== undefined) {
        productPayload.stock_quantity = selectedProduct.stock
        productPayload.in_stock = selectedProduct.stock > 0
      }
      if (selectedProduct.shortDesc) {
        productPayload.short_desc = selectedProduct.shortDesc
      }
      if (selectedProduct.description) {
        productPayload.description = selectedProduct.description
      }
      if (selectedProduct.badge) {
        productPayload.badge = selectedProduct.badge
      }
      productPayload.is_active = selectedProduct.isActive
      productPayload.is_featured = selectedProduct.isFeatured || false

      // For CREATE: Include images
      if (!selectedProduct.id || selectedProduct.id === 0) {
        // Primary image is required for new products
        if (!selectedFile) {
          setError('Please select a primary image')
          return
        }
        productPayload.image = selectedFile
        if (selectedAdditionalImages.length > 0) {
          productPayload.images = selectedAdditionalImages
        }
      }
      // For UPDATE: No image handling - use separate APIs for image changes

      if (selectedProduct.id && selectedProduct.id > 0) {
        // Update existing product
        const updated = await updateProduct({
          id: selectedProduct.id,
          ...productPayload,
        })
        const updatedProduct = mapBackendToFrontend(updated)
        setProducts(products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)))
        setEditDialogOpen(false)
        setSuccessMessage('Product updated successfully!')
        setRefreshKey((k) => k + 1)
      } else {
        // Create new product - primary image file is required
        if (!selectedFile) {
          setError('Please select a primary image')
          return
        }
        const created = await createProduct(productPayload)
        const newProduct = mapBackendToFrontend(created)
        setProducts([...products, newProduct])
        setAddDialogOpen(false)
        setSuccessMessage('Product created successfully!')
        setRefreshKey((k) => k + 1)
      }
      setSelectedProduct(null)
      setSelectedFile(null)
      setSelectedAdditionalImages([])
      setImagesToDelete([])
    } catch (err: any) {
      console.error('Error saving product:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      setError(null)
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      setSuccessMessage('Product deleted successfully!')
    } catch (err: any) {
      console.error('Error deleting product:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to delete product')
    }
  }

  const handleToggleActive = async (id: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    const updatedProduct = { ...product, isActive: !product.isActive }
    try {
      setError(null)
      const updated = await updateProduct({
        id,
        is_active: updatedProduct.isActive,
      })
      const mappedUpdated = mapBackendToFrontend(updated)
      setProducts(products.map((p) => (p.id === id ? mappedUpdated : p)))
    } catch (err: any) {
      console.error('Error toggling product status:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update product status')
      // Revert on error
      setProducts(products.map((p) => (p.id === id ? product : p)))
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setDeletingImageId(imageId)
      setError(null)
      await deleteProductImage(imageId)
      
      // Refresh product details to get updated image list
      if (selectedProductForImage && selectedProductForImage.id) {
        const fullProduct = await getProductById(selectedProductForImage.id)
        const mappedProduct = mapBackendToFrontend(fullProduct)
        setSelectedProductForImage(mappedProduct)
      }
      
      // Also update the products list
      setRefreshKey((k) => k + 1)
      setSuccessMessage('Image deleted successfully')
    } catch (err: any) {
      console.error('Error deleting image:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to delete image')
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleChangePrimaryImage = async (product: ProductDisplay) => {
    try {
      setError(null)
      const fullProduct = await getProductById(product.id)
      const mappedProduct = mapBackendToFrontend(fullProduct)
      setSelectedProductForImage(mappedProduct)
      setSelectedFile(null)
      setChangePrimaryImageDialogOpen(true)
    } catch (err: any) {
      console.error('Error fetching product details:', err)
      setError(err?.response?.data?.error?.message || 'Failed to load product details')
    }
  }

  const handleAddAdditionalImages = async (product: ProductDisplay) => {
    try {
      setError(null)
      const fullProduct = await getProductById(product.id)
      const mappedProduct = mapBackendToFrontend(fullProduct)
      setSelectedProductForImage(mappedProduct)
      setSelectedAdditionalImages([])
      setAddAdditionalImagesDialogOpen(true)
    } catch (err: any) {
      console.error('Error fetching product details:', err)
      setError(err?.response?.data?.error?.message || 'Failed to load product details')
    }
  }

  const handleSavePrimaryImage = async () => {
    if (!selectedProductForImage || !selectedFile) {
      setError('Please select an image')
      return
    }

    try {
      setUploadingImage(true)
      setError(null)
      await changePrimaryImage(selectedProductForImage.id, selectedFile)
      setChangePrimaryImageDialogOpen(false)
      setSelectedFile(null)
      setSelectedProductForImage(null)
      setSuccessMessage('Primary image changed successfully')
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Error changing primary image:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to change primary image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveAdditionalImages = async () => {
    if (!selectedProductForImage || selectedAdditionalImages.length === 0) {
      setError('Please select at least one image')
      return
    }

    // Validate max 10 images total (existing + new)
    const existingCount = selectedProductForImage.allImages?.filter((img: any) => (img.is_primary === 0 || img.is_primary === false)).length || 0
    if (existingCount + selectedAdditionalImages.length > 10) {
      setError(`Maximum 10 additional images allowed. You already have ${existingCount} image(s).`)
      return
    }

    // Validate total size (max 20MB)
    const totalSize = selectedAdditionalImages.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 20 * 1024 * 1024 // 20MB in bytes
    if (totalSize > maxSize) {
      setError('Total size of additional images must not exceed 20MB')
      return
    }

    try {
      setUploadingImage(true)
      setError(null)
      await addAdditionalImages(selectedProductForImage.id, selectedAdditionalImages)
      setAddAdditionalImagesDialogOpen(false)
      setSelectedAdditionalImages([])
      setSelectedProductForImage(null)
      setSuccessMessage(`${selectedAdditionalImages.length} additional image(s) added successfully`)
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Error adding additional images:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to add additional images')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Products Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Product
          </Button>
        </Box>

        {(error || successMessage) && (
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError(null)
              setSuccessMessage(null)
            }}
            sx={{ mb: 2 }}
          >
            {error || successMessage}
          </Alert>
        )}

        <TextField
          placeholder="Search products..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: { xs: '100%', sm: 300 } }}
          fullWidth={false}
          disabled={loading}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'No products found matching your search.' : 'No products found. Click "Add Product" to create one.'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={product.imageUrl}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        >
                          <ProductIcon />
                        </Avatar>
                        {product.allImages && product.allImages.length > 1 && (
                          <Chip
                            label={`+${product.allImages.length - 1}`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: -4,
                              right: -4,
                              fontSize: '0.65rem',
                              height: 18,
                              minWidth: 24,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      ID: {product.id}
                      {product.allImages && product.allImages.length > 0 && (
                        <> • {product.allImages.length} img</>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      €{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price || 0)).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock}
                      size="small"
                      color={product.stock === 0 ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={product.isActive}
                          onChange={() => handleToggleActive(product.id)}
                          size="small"
                        />
                      }
                      label={product.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(product)}
                          color="primary"
                          title="Edit Product"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(product.id)}
                          color="error"
                          title="Delete Product"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleChangePrimaryImage(product)}
                          sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                        >
                          Change Image
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleAddAdditionalImages(product)}
                          sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                        >
                          Add Images
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedProduct(null)
          setSelectedFile(null)
          setSelectedAdditionalImages([])
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedProduct?.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Product Title"
                value={selectedProduct.title}
                onChange={(e) => {
                  const newTitle = e.target.value
                  setSelectedProduct({ ...selectedProduct, title: newTitle, name: newTitle })
                }}
                sx={{ mb: 2 }}
                required
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedProduct.categoryId || ''}
                  onChange={(e) => {
                    const categoryId = e.target.value as number
                    const category = categories.find((c) => c.id === categoryId)
                    setSelectedProduct({
                      ...selectedProduct,
                      categoryId,
                      category: category?.name || '',
                    })
                  }}
                  label="Category"
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={selectedProduct.stock}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Short Description"
                value={selectedProduct.shortDesc || ''}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, shortDesc: e.target.value })
                }
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              {/* Image uploads only for CREATE, not for UPDATE */}
              {(!selectedProduct.id || selectedProduct.id === 0) && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Primary Image *
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={saving}
                  >
                    {saving ? 'Uploading...' : 'Upload Primary Image *'}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>
                  {selectedProduct.imageUrl && (
                    <Box
                      component="img"
                      src={selectedProduct.imageUrl}
                      alt="Primary Preview"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 1,
                        mb: 2,
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.png'
                      }}
                    />
                  )}
                  <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
                    Additional Images (Max 10, Max 20MB total)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={saving}
                  >
                    {saving ? 'Uploading...' : `Upload Additional Images (${selectedAdditionalImages.length} selected)`}
                    <input type="file" hidden accept="image/*" multiple onChange={handleAdditionalImagesUpload} />
                  </Button>
                  {selectedAdditionalImages.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {selectedAdditionalImages.length} image(s) selected
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedAdditionalImages.map((file, index) => (
                          <Box key={index} sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid rgba(255,255,255,0.1)',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                const newFiles = selectedAdditionalImages.filter((_, i) => i !== index)
                                setSelectedAdditionalImages(newFiles)
                              }}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: 'error.main',
                                color: 'white',
                                width: 20,
                                height: 20,
                                '&:hover': { bgcolor: 'error.dark' },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedProduct.isActive}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedProduct.isFeatured || false}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, isFeatured: e.target.checked })
                    }
                  />
                }
                label="Featured"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedProduct(null)
              setSelectedFile(null)
              setSelectedAdditionalImages([])
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Primary Image Dialog */}
      <Dialog
        open={changePrimaryImageDialogOpen}
        onClose={() => {
          setChangePrimaryImageDialogOpen(false)
          setSelectedFile(null)
          setSelectedProductForImage(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Primary Image</DialogTitle>
        <DialogContent>
          {selectedProductForImage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current primary image:
              </Typography>
              {selectedProductForImage.imageUrl && (
                <Box
                  component="img"
                  src={selectedProductForImage.imageUrl}
                  alt="Current Primary"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              )}
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Select New Primary Image *'}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              {selectedFile && (
                <Box
                  component="img"
                  src={URL.createObjectURL(selectedFile)}
                  alt="New Primary Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChangePrimaryImageDialogOpen(false)
              setSelectedFile(null)
              setSelectedProductForImage(null)
            }}
            disabled={uploadingImage}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePrimaryImage}
            variant="contained"
            disabled={uploadingImage || !selectedFile}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {uploadingImage ? <CircularProgress size={20} /> : 'Change Image'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Additional Images Dialog */}
      <Dialog
        open={addAdditionalImagesDialogOpen}
        onClose={() => {
          setAddAdditionalImagesDialogOpen(false)
          setSelectedAdditionalImages([])
          setSelectedProductForImage(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Additional Images</DialogTitle>
        <DialogContent>
          {selectedProductForImage && (
            <Box sx={{ mt: 2 }}>
              {/* Show existing additional images with delete option */}
              {selectedProductForImage.allImages && selectedProductForImage.allImages.filter((img: any) => (img.is_primary === 0 || img.is_primary === false)).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Existing Additional Images ({selectedProductForImage.allImages.filter((img: any) => (img.is_primary === 0 || img.is_primary === false)).length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedProductForImage.allImages
                      .filter((img: any) => (img.is_primary === 0 || img.is_primary === false))
                      .map((img) => (
                        <Box key={img.id} sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={img.image_url}
                            alt={`Existing ${img.id}`}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid rgba(255,255,255,0.1)',
                              opacity: deletingImageId === img.id ? 0.5 : 1,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(img.id)}
                            disabled={deletingImageId === img.id || uploadingImage}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'error.main',
                              color: 'white',
                              width: 20,
                              height: 20,
                              '&:hover': { bgcolor: 'error.dark' },
                              '&:disabled': { opacity: 0.5 },
                            }}
                          >
                            {deletingImageId === img.id ? (
                              <CircularProgress size={12} sx={{ color: 'white' }} />
                            ) : (
                              <CloseIcon sx={{ fontSize: 14 }} />
                            )}
                          </IconButton>
                        </Box>
                      ))}
                  </Box>
                </Box>
              )}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Add New Images (Max 10 total, Max 20MB)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : `Select Images (${selectedAdditionalImages.length} selected)`}
                <input type="file" hidden accept="image/*" multiple onChange={handleAdditionalImagesUpload} />
              </Button>
              {selectedAdditionalImages.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {selectedAdditionalImages.length} new image(s) selected
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedAdditionalImages.map((file, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            const newFiles = selectedAdditionalImages.filter((_, i) => i !== index)
                            setSelectedAdditionalImages(newFiles)
                          }}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'error.main',
                            color: 'white',
                            width: 20,
                            height: 20,
                            '&:hover': { bgcolor: 'error.dark' },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddAdditionalImagesDialogOpen(false)
              setSelectedAdditionalImages([])
              setSelectedProductForImage(null)
            }}
            disabled={uploadingImage}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAdditionalImages}
            variant="contained"
            disabled={uploadingImage || selectedAdditionalImages.length === 0}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {uploadingImage ? <CircularProgress size={20} /> : 'Add Images'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default Products


