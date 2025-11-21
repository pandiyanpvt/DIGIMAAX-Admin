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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic products and devices',
    slug: 'electronics',
    isActive: true,
    productCount: 25,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Apparel and fashion items',
    slug: 'clothing',
    isActive: true,
    productCount: 18,
    createdAt: '2024-01-14',
  },
  {
    id: 3,
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    slug: 'home-garden',
    isActive: false,
    productCount: 12,
    createdAt: '2024-01-13',
  },
]

function ProductCategories() {
  const [categories, setCategories] = useState(sampleCategories)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setSelectedCategory({
      name: '',
      description: '',
      slug: '',
      isActive: true,
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (category: any) => {
    setSelectedCategory({ ...category })
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedCategory) {
      if (selectedCategory.id) {
        setCategories(
          categories.map((c) => (c.id === selectedCategory.id ? selectedCategory : c))
        )
        setEditDialogOpen(false)
      } else {
        const newCategory = {
          ...selectedCategory,
          id: Date.now(),
          productCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          slug: selectedCategory.slug || selectedCategory.name.toLowerCase().replace(/\s+/g, '-'),
        }
        setCategories([...categories, newCategory])
        setAddDialogOpen(false)
      }
      setSelectedCategory(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  const handleToggleActive = (id: number) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Product Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Category
          </Button>
        </Box>

        <TextField
          placeholder="Search categories..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: 300 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
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
                    <Typography variant="body2">{category.description}</Typography>
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
                onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedCategory.description}
                onChange={(e) =>
                  setSelectedCategory({ ...selectedCategory, description: e.target.value })
                }
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Slug"
                value={selectedCategory.slug}
                onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                placeholder="auto-generated-from-name"
                sx={{ mb: 2 }}
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
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default ProductCategories

