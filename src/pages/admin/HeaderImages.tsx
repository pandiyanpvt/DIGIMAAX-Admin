import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllHeaderImages,
  createHeaderImage,
  updateHeaderImage,
  deleteHeaderImage,
  uploadHeaderImage,
  type HeaderImage,
} from '../../api/headerImages'

interface DisplayHeaderImage {
  id?: number
  title?: string
  imageUrl: string
  order: number
  isActive: boolean
  createdAt?: string
}

function HeaderImages() {
  const [images, setImages] = useState<HeaderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<DisplayHeaderImage | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Fetch header images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllHeaderImages()
        setImages(data)
      } catch (err: any) {
        console.error('Error fetching header images:', err)
        setError(err?.response?.data?.message || 'Failed to fetch header images')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleAdd = () => {
    const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.order_no)) : 0
    setSelectedImage({
      title: '',
      imageUrl: '',
      order: maxOrder + 1,
      isActive: true,
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (image: HeaderImage) => {
    setSelectedImage({
      id: image.id,
      title: '', // Backend doesn't have title field
      imageUrl: image.img_url,
      order: image.order_no,
      isActive: image.is_active,
      createdAt: image.created_at,
    })
    setEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedImage) return

    try {
      setUploading(true)
      setError(null)

      if (selectedImage.id) {
        // Update existing image
        const payload: any = {
          id: selectedImage.id,
          order_no: selectedImage.order,
          is_active: selectedImage.isActive,
        }

        if (selectedImage.imageUrl) {
          payload.img_url = selectedImage.imageUrl
        }

        const updated = await updateHeaderImage(payload)
        setImages(images.map((img) => (img.id === updated.id ? updated : img)))
        setSuccessMessage('Header image updated successfully')
        setEditDialogOpen(false)
      } else {
        // Create new image
        const payload: any = {
          order_no: selectedImage.order,
          is_active: selectedImage.isActive,
        }

        if (selectedImage.imageUrl) {
          payload.img_url = selectedImage.imageUrl
        }

        const created = await createHeaderImage(payload)
        setImages([...images, created])
        setSuccessMessage('Header image created successfully')
        setAddDialogOpen(false)
      }
      setSelectedImage(null)
    } catch (err: any) {
      console.error('Error saving header image:', err)
      setError(err?.response?.data?.message || 'Failed to save header image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this header image?')) {
      return
    }

    try {
      setError(null)
      await deleteHeaderImage(id)
      setImages(images.filter((img) => img.id !== id))
      setSuccessMessage('Header image deleted successfully')
    } catch (err: any) {
      console.error('Error deleting header image:', err)
      setError(err?.response?.data?.message || 'Failed to delete header image')
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      const result = await uploadHeaderImage(file)
      if (selectedImage) {
        setSelectedImage({ ...selectedImage, imageUrl: result.url })
      }
      setSuccessMessage('Image uploaded successfully')
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err?.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Header Images Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Header Image
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : images.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No header images found. Add your first header image.
            </Typography>
          </Box>
        ) : (
          <ImageList 
            cols={{ xs: 1, sm: 2, md: 3 }} 
            gap={{ xs: 8, sm: 12, md: 16 }}
          >
            {images.map((image) => (
              <ImageListItem key={image.id}>
                <Box
                  component="img"
                  src={image.img_url}
                  alt={`Header Image ${image.order_no}`}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.png'
                  }}
                />
                <ImageListItemBar
                  title={`Order: ${image.order_no}`}
                  subtitle={image.is_active ? 'Active' : 'Inactive'}
                  actionIcon={
                    <Box>
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        onClick={() => handleEdit(image)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        onClick={() => handleDelete(image.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedImage(null)
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle>{selectedImage?.id ? 'Edit Header Image' : 'Add Header Image'}</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={selectedImage.imageUrl}
                onChange={(e) => setSelectedImage({ ...selectedImage, imageUrl: e.target.value })}
                placeholder="Enter image URL or upload a file"
                sx={{ mb: 2 }}
                disabled={uploading}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              {selectedImage.imageUrl && (
                <Box
                  component="img"
                  src={selectedImage.imageUrl}
                  alt="Preview"
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
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={selectedImage.order}
                onChange={(e) =>
                  setSelectedImage({ ...selectedImage, order: parseInt(e.target.value) || 0 })
                }
                sx={{ mb: 2 }}
                disabled={uploading}
                helperText="Order number determines display sequence"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedImage.isActive}
                    onChange={(e) =>
                      setSelectedImage({ ...selectedImage, isActive: e.target.checked })
                    }
                    disabled={uploading}
                  />
                }
                label="Active"
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedImage(null)
            }}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: 'primary.main' }}
            disabled={uploading || !selectedImage?.imageUrl || !selectedImage?.order}
          >
            {uploading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  )
}

export default HeaderImages


