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
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type ProductCategory,
} from '../../api/categories'

// Frontend display interface (includes computed fields)
interface CategoryDisplay {
  id: number
  name: string
  description?: string // Frontend-only, not saved to backend
  slug: string // Auto-generated from name, frontend-only
  isActive: boolean
  productCount: number
  createdAt: string
  customizationColor: boolean
  customizationSize: boolean
  customizationText: boolean
  customizationImage: boolean
}

// Map backend data to frontend display format
const mapBackendToFrontend = (backendCategory: ProductCategory): CategoryDisplay => ({
  id: backendCategory.id,
  name: backendCategory.name,
  description: '', // Not in backend, keep empty
  slug: backendCategory.name.toLowerCase().replace(/\s+/g, '-'), // Auto-generate from name
  isActive: Boolean(backendCategory.is_active ?? true),
  productCount: backendCategory.product_count ?? 0,
  createdAt: backendCategory.created_at ? new Date(backendCategory.created_at).toISOString().split('T')[0] : '',
  // Convert 0/1 to boolean (backend sends as number)
  customizationColor: Boolean(backendCategory.customization_color ?? 0),
  customizationSize: Boolean(backendCategory.customization_size ?? 0),
  customizationText: Boolean(backendCategory.customization_text ?? 0),
  customizationImage: Boolean(backendCategory.customization_image ?? 0),
})

function ProductCategories() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryDisplay | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const backendCategories = await getAllCategories()
        const mappedCategories = backendCategories.map(mapBackendToFrontend)
        setCategories(mappedCategories)
      } catch (err: any) {
        console.error('Error fetching categories:', err)
        setError(err?.response?.data?.error?.message || err?.message || 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedCategory({
      id: 0, // Temporary ID for new category
      name: '',
      description: '',
      slug: '',
      isActive: true,
      productCount: 0,
      createdAt: '',
      customizationColor: false,
      customizationSize: false,
      customizationText: false,
      customizationImage: false,
    })
    setAddDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleEdit = (category: CategoryDisplay) => {
    setSelectedCategory({ ...category })
    setEditDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    if (!selectedCategory) return

    // Validate
    if (!selectedCategory.name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      if (selectedCategory.id && selectedCategory.id > 0) {
        // Update existing category
        const updated = await updateCategory({
          id: selectedCategory.id,
          name: selectedCategory.name,
          is_active: selectedCategory.isActive,
          customization_color: selectedCategory.customizationColor,
          customization_size: selectedCategory.customizationSize,
          customization_text: selectedCategory.customizationText,
          customization_image: selectedCategory.customizationImage,
        })
        const updatedCategory = mapBackendToFrontend(updated)
        setCategories(categories.map((c) => (c.id === selectedCategory.id ? updatedCategory : c)))
        setEditDialogOpen(false)
        setSuccessMessage('Category updated successfully!')
      } else {
        // Create new category
        const created = await createCategory({
          name: selectedCategory.name,
          is_active: selectedCategory.isActive,
          customization_color: selectedCategory.customizationColor,
          customization_size: selectedCategory.customizationSize,
          customization_text: selectedCategory.customizationText,
          customization_image: selectedCategory.customizationImage,
        })
        const newCategory = mapBackendToFrontend(created)
        setCategories([...categories, newCategory])
        setAddDialogOpen(false)
        setSuccessMessage('Category created successfully!')
      }
      setSelectedCategory(null)
    } catch (err: any) {
      console.error('Error saving category:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setError(null)
      await deleteCategory(id)
      setCategories(categories.filter((c) => c.id !== id))
      setSuccessMessage('Category deleted successfully!')
    } catch (err: any) {
      console.error('Error deleting category:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to delete category')
    }
  }

  const handleToggleActive = async (id: number) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return

    const updatedCategory = { ...category, isActive: !category.isActive }
    try {
      setError(null)
      const updated = await updateCategory({
        id,
        is_active: updatedCategory.isActive,
      })
      const mappedUpdated = mapBackendToFrontend(updated)
      // Preserve description (frontend-only)
      mappedUpdated.description = category.description
      setCategories(categories.map((c) => (c.id === id ? mappedUpdated : c)))
    } catch (err: any) {
      console.error('Error toggling category status:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update category status')
      // Revert on error
      setCategories(categories.map((c) => (c.id === id ? category : c)))
    }
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Product Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Category
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
          placeholder="Search categories..."
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
        ) : filteredCategories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'No categories found matching your search.' : 'No categories found. Click "Add Category" to create one.'}
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon color="primary" />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{category.slug}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={category.productCount} size="small" />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={category.isActive}
                          onChange={() => handleToggleActive(category.id)}
                          size="small"
                        />
                      }
                      label={category.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(category.id)}
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
          setSelectedCategory(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory?.id ? 'Edit Product Category' : 'Add Product Category'}
        </DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                value={selectedCategory.name}
                onChange={(e) => {
                  const newName = e.target.value
                  const newSlug = newName.toLowerCase().replace(/\s+/g, '-')
                  setSelectedCategory({ ...selectedCategory, name: newName, slug: newSlug })
                }}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Slug (auto-generated)"
                value={selectedCategory.slug || selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}
                onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                placeholder="auto-generated-from-name"
                sx={{ mb: 2 }}
                helperText="Slug is auto-generated from name. This is for display only and not saved to backend."
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.isActive}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle2" sx={{ mb: 1.5, mt: 2, fontWeight: 600 }}>
                Customization Options
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.customizationColor}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, customizationColor: e.target.checked })
                    }
                  />
                }
                label="Color Customization"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.customizationSize}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, customizationSize: e.target.checked })
                    }
                  />
                }
                label="Size Customization"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.customizationText}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, customizationText: e.target.checked })
                    }
                  />
                }
                label="Text Customization"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.customizationImage}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, customizationImage: e.target.checked })
                    }
                  />
                }
                label="Image Customization"
                sx={{ mb: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedCategory(null)
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

export default ProductCategories


