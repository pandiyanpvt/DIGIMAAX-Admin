import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  uploadGalleryImage,
  type GalleryImage,
} from '../../api/gallery'

function GalleryManagement() {
  const [media, setMedia] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    img_url: '',
    is_active: true,
  })

  // Fetch gallery images from backend
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllGalleryImages()
        setMedia(data)
      } catch (err: any) {
        console.error('Error fetching gallery images:', err)
        setError(err?.response?.data?.message || 'Failed to fetch gallery images')
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const handleUpload = () => {
    setFormData({ name: '', description: '', img_url: '', is_active: true })
    setSelectedMedia(null)
    setUploadDialogOpen(true)
  }

  const handleEdit = (item: GalleryImage) => {
    setSelectedMedia(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      img_url: item.img_url,
      is_active: item.is_active,
    })
    setEditDialogOpen(true)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      const result = await uploadGalleryImage(file)
      setFormData({ ...formData, img_url: result.url })
      setSuccessMessage('Image uploaded successfully')
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err?.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.img_url) {
      setError('Name and image are required')
      return
    }

    try {
      setUploading(true)
      setError(null)

      if (selectedMedia) {
        // Update existing image
        const payload: any = {
          id: selectedMedia.id,
          name: formData.name,
          description: formData.description || undefined,
          img_url: formData.img_url,
          is_active: formData.is_active,
        }

        const updated = await updateGalleryImage(payload)
        setMedia(media.map((m) => (m.id === updated.id ? updated : m)))
        setSuccessMessage('Gallery item updated successfully')
        setEditDialogOpen(false)
      } else {
        // Create new image
        const payload: any = {
          name: formData.name,
          description: formData.description || undefined,
          img_url: formData.img_url,
          is_active: formData.is_active,
        }

        const created = await createGalleryImage(payload)
        setMedia([...media, created])
        setSuccessMessage('Gallery item created successfully')
        setUploadDialogOpen(false)
      }
      setFormData({ name: '', description: '', img_url: '', is_active: true })
      setSelectedMedia(null)
    } catch (err: any) {
      console.error('Error saving gallery item:', err)
      setError(err?.response?.data?.message || 'Failed to save gallery item')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) {
      return
    }

    try {
      setError(null)
      await deleteGalleryImage(id)
      setMedia(media.filter((m) => m.id !== id))
      setSuccessMessage('Gallery item deleted successfully')
    } catch (err: any) {
      console.error('Error deleting gallery item:', err)
      setError(err?.response?.data?.message || 'Failed to delete gallery item')
    }
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Gallery / Media Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleUpload}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Upload Media
          </Button>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : media.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No gallery items found. Upload your first gallery item.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {media.map((item) => (
            <Card key={item.id} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={item.img_url}
                alt={item.name}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  backgroundColor: '#f0f0f0',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0;"><svg style="font-size: 60px; color: #ccc;" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>`
                  }
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {item.name}
                </Typography>
                {item.description && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {item.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={item.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={item.is_active ? 'success' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(item)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Gallery Item</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              disabled={uploading}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              disabled={uploading}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.img_url}
              onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
              placeholder="Enter image URL or upload a file"
              sx={{ mb: 2 }}
              disabled={uploading}
              required
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
            {formData.img_url && (
              <Box
                component="img"
                src={formData.img_url}
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
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  disabled={uploading}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: 'primary.main' }}
            disabled={uploading || !formData.name || !formData.img_url}
          >
            {uploading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Gallery Item</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              disabled={uploading}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              disabled={uploading}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.img_url}
              onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
              placeholder="Enter image URL or upload a file"
              sx={{ mb: 2 }}
              disabled={uploading}
              required
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
            {formData.img_url && (
              <Box
                component="img"
                src={formData.img_url}
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
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  disabled={uploading}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: 'primary.main' }}
            disabled={uploading || !formData.name || !formData.img_url}
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

export default GalleryManagement

