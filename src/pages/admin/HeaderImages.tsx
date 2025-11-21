import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Grid,
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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const sampleHeaderImages = [
  {
    id: 1,
    title: 'Homepage Header',
    imageUrl: '/DIGIMAAX_LOGO-01 1.png',
    order: 1,
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'About Page Header',
    imageUrl: '/DIGIMAAX_LOGO-01 1.png',
    order: 2,
    isActive: true,
    createdAt: '2024-01-14',
  },
]

function HeaderImages() {
  const [images, setImages] = useState(sampleHeaderImages)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const handleAdd = () => {
    setSelectedImage({
      title: '',
      imageUrl: '',
      order: images.length + 1,
      isActive: true,
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (image: any) => {
    setSelectedImage({ ...image })
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedImage) {
      if (selectedImage.id) {
        setImages(images.map((img) => (img.id === selectedImage.id ? selectedImage : img)))
        setEditDialogOpen(false)
      } else {
        const newImage = {
          ...selectedImage,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        }
        setImages([...images, newImage])
        setAddDialogOpen(false)
      }
      setSelectedImage(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this header image?')) {
      setImages(images.filter((img) => img.id !== id))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (selectedImage) {
          setSelectedImage({ ...selectedImage, imageUrl: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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

        <ImageList cols={3} gap={16}>
          {images.map((image) => (
            <ImageListItem key={image.id}>
              <Box
                component="img"
                src={image.imageUrl}
                alt={image.title}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
              <ImageListItemBar
                title={image.title}
                subtitle={`Order: ${image.order} | ${image.isActive ? 'Active' : 'Inactive'}`}
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
      >
        <DialogTitle>{selectedImage?.id ? 'Edit Header Image' : 'Add Header Image'}</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={selectedImage.title}
                onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedImage.imageUrl}
                onChange={(e) => setSelectedImage({ ...selectedImage, imageUrl: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Image
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

export default HeaderImages

