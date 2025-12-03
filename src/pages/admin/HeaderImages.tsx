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
import ConfirmDialog from '../../components/common/ConfirmDialog'
import {
  getAllHeaderImages,
  createHeaderImage,
  updateHeaderImage,
  deleteHeaderImage,
  type HeaderImage,
  type CreateHeaderImagePayload,
  type UpdateHeaderImagePayload,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

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
  }, [refreshKey])

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

    // For new images, require file
    if (!selectedImage.id && !selectedFile) {
      setError('Please select an image')
      return
    }

    try {
      setUploading(true)
      setError(null)

      if (selectedImage.id) {
        // Update existing image
        const payload: UpdateHeaderImagePayload = {
          id: selectedImage.id,
          order_no: selectedImage.order,
          is_active: selectedImage.isActive,
        }

        if (selectedFile) {
          payload.image = selectedFile
        }

        await updateHeaderImage(payload)
        setSuccessMessage('Header image updated successfully')
        setEditDialogOpen(false)
        setRefreshKey((k) => k + 1)
      } else {
        // Create new image - file is required
        const payload: CreateHeaderImagePayload = {
          image: selectedFile!,
          order_no: selectedImage.order,
          is_active: selectedImage.isActive,
        }

        await createHeaderImage(payload)
        setSuccessMessage('Header image created successfully')
        setAddDialogOpen(false)
        setRefreshKey((k) => k + 1)
      }
      setSelectedImage(null)
      setSelectedFile(null)
    } catch (err: any) {
      console.error('Error saving header image:', err)
      setError(err?.response?.data?.message || 'Failed to save header image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (id: number) => {
    setImageToDelete(id)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (imageToDelete === null) return

    try {
      setDeleting(true)
      setError(null)
      await deleteHeaderImage(imageToDelete)
      setImages(images.filter((img) => img.id !== imageToDelete))
      setSuccessMessage('Header image deleted successfully')
      setConfirmDialogOpen(false)
      setImageToDelete(null)
    } catch (err: any) {
      console.error('Error deleting header image:', err)
      setError(err?.response?.data?.message || 'Failed to delete header image')
      setConfirmDialogOpen(false)
      setImageToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    if (selectedImage) {
      setSelectedImage({ ...selectedImage, imageUrl: previewUrl })
    }
    setSuccessMessage('Image selected successfully')
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              width: '100%',
            }}
          >
            {images.map((image) => (
              <Box key={image.id}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.img_url}
                    alt={`Header Image ${image.order_no}`}
                    sx={{
                      width: '100%',
                      height: 225,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-image.png'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                      p: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        Order: {image.order_no}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {image.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                        onClick={() => handleEdit(image)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                        onClick={() => handleDelete(image.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
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
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : selectedImage.id ? 'Change Image' : 'Upload Image *'}
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

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Header Image"
        message="Are you sure you want to delete this header image? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDialogOpen(false)
          setImageToDelete(null)
        }}
        loading={deleting}
      />
    </PageContainer>
  )
}

export default HeaderImages


