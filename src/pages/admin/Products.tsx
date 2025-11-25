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
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
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
  isActive: boolean
  createdAt: string
}

// Map backend data to frontend display format
const mapBackendToFrontend = (backendProduct: Product): ProductDisplay => ({
  id: backendProduct.id,
  name: backendProduct.title, // Use title as name for display
  title: backendProduct.title,
  category: backendProduct.category_name || backendProduct.category?.name || 'Uncategorized',
  categoryId: backendProduct.category_id || backendProduct.category?.id,
  price: typeof backendProduct.price === 'string' ? parseFloat(backendProduct.price) : (backendProduct.price || 0),
  stock: backendProduct.stock_quantity ?? 0,
  imageUrl: backendProduct.primary_image || (backendProduct.images && backendProduct.images[0]?.image_url) || '',
  isActive: backendProduct.is_active ?? true,
  createdAt: backendProduct.created_at ? new Date(backendProduct.created_at).toISOString().split('T')[0] : '',
})

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
  }, [])

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
    })
    setAddDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleEdit = (product: ProductDisplay) => {
    setSelectedProduct({ ...product })
    setEditDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
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

      const productPayload = {
        title: selectedProduct.title,
        category_id: selectedProduct.categoryId,
        price: selectedProduct.price,
        stock_quantity: selectedProduct.stock,
        in_stock: selectedProduct.stock > 0,
        is_active: selectedProduct.isActive,
        images: selectedProduct.imageUrl ? [selectedProduct.imageUrl] : undefined,
      }

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
      } else {
        // Create new product
        const created = await createProduct(productPayload)
        const newProduct = mapBackendToFrontend(created)
        setProducts([...products, newProduct])
        setAddDialogOpen(false)
        setSuccessMessage('Product created successfully!')
      }
      setSelectedProduct(null)
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
                      <Avatar
                        src={product.imageUrl}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      >
                        <ProductIcon />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      ID: {product.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price || 0)).toFixed(2)}
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
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(product)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
                label="Image URL"
                value={selectedProduct.imageUrl}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value })
                }
                sx={{ mb: 2 }}
              />
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
    </PageContainer>
  )
}

export default Products


