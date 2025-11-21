import { useState } from 'react'
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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as ProductIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleProducts = [
  {
    id: 1,
    name: 'Product 1',
    sku: 'PROD-001',
    category: 'Electronics',
    price: 99.99,
    stock: 50,
    imageUrl: '/DIGIMAAX_LOGO-01 1.png',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Product 2',
    sku: 'PROD-002',
    category: 'Clothing',
    price: 49.99,
    stock: 30,
    imageUrl: '/DIGIMAAX_LOGO-01 1.png',
    isActive: true,
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'Product 3',
    sku: 'PROD-003',
    category: 'Home & Garden',
    price: 79.99,
    stock: 0,
    imageUrl: '/DIGIMAAX_LOGO-01 1.png',
    isActive: false,
    createdAt: '2024-01-13',
  },
]

function Products() {
  const [products, setProducts] = useState(sampleProducts)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedProduct({
      name: '',
      sku: '',
      category: '',
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (product: any) => {
    setSelectedProduct({ ...product })
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedProduct) {
      if (selectedProduct.id) {
        setProducts(products.map((p) => (p.id === selectedProduct.id ? selectedProduct : p)))
        setEditDialogOpen(false)
      } else {
        const newProduct = {
          ...selectedProduct,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        }
        setProducts([...products, newProduct])
        setAddDialogOpen(false)
      }
      setSelectedProduct(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleToggleActive = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Products Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Product
          </Button>
        </Box>

        <TextField
          placeholder="Search products..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: 300 }}
        />

        <TableContainer>
          <Table>
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
                    <Typography variant="body2">{product.sku}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">${product.price.toFixed(2)}</Typography>
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
                label="Product Name"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="SKU"
                value={selectedProduct.sku}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Category"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, category: e.target.value })
                }
                sx={{ mb: 2 }}
              />
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
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default Products

