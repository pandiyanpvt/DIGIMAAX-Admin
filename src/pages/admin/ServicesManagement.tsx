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
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Snackbar,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Build as ServiceIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  updateServiceImage,
  updateServicePoint,
  saveServicePoint,
  deleteServicePoint,
  deleteService,
  type Service,
  type ServicePoint,
} from '../../api/services'

// Frontend display interface
interface ServiceDisplay {
  id: number
  name: string
  nameFrench?: string
  imageUrl: string
  points: ServicePoint[]
}

// Map backend data to frontend display format
const mapBackendToFrontend = (backendService: Service): ServiceDisplay => ({
  id: backendService.id,
  name: backendService.name,
  nameFrench: backendService.name_french || '',
  imageUrl: backendService.img_url || '',
  points: backendService.points || [],
})

interface ServicePointForm {
  point: string
  point_french: string
}

function ServicesManagement() {
  const [services, setServices] = useState<ServiceDisplay[]>([])
  const [selectedService, setSelectedService] = useState<ServiceDisplay | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [pointDialogOpen, setPointDialogOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(null)
  const [pointFormData, setPointFormData] = useState({ point: '', point_french: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    name_french: '',
    points: [{ point: '', point_french: '' }] as ServicePointForm[],
  })

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        const backendServices = await getAllServices()
        const mappedServices = backendServices.map(mapBackendToFrontend)
        setServices(mappedServices)
      } catch (err: any) {
        console.error('Error fetching services:', err)
        setError(err?.response?.data?.error?.message || err?.message || 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [refreshKey])

  const handleAdd = () => {
    setSelectedService(null)
    setFormData({
      name: '',
      name_french: '',
      points: [{ point: '', point_french: '' }],
    })
    setSelectedFile(null)
    setAddDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleEdit = async (service: ServiceDisplay) => {
    try {
      setError(null)
      const fullService = await getServiceById(service.id)
      const mappedService = mapBackendToFrontend(fullService)
      setSelectedService(mappedService)
      setFormData({
        name: mappedService.name,
        name_french: mappedService.nameFrench || '',
        points: [], // New points to be added
      })
      setSelectedFile(null)
      setEditDialogOpen(true)
      setSuccessMessage(null)
    } catch (err: any) {
      console.error('Error fetching service details:', err)
      setError(err?.response?.data?.error?.message || 'Failed to load service details')
    }
  }

  const handleImageUpdate = async (service: ServiceDisplay) => {
    setSelectedService(service)
    setSelectedFile(null)
    setImageDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handlePointEdit = (point: ServicePoint) => {
    setSelectedPoint(point)
    setPointFormData({
      point: point.point || '',
      point_french: point.point_french || '',
    })
    setPointDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setSuccessMessage('Image selected successfully')
  }

  const addPoint = () => {
    setFormData({
      ...formData,
      points: [...formData.points, { point: '', point_french: '' }],
    })
  }

  const removePoint = (index: number) => {
    const newPoints = formData.points.filter((_, i) => i !== index)
    setFormData({ ...formData, points: newPoints.length > 0 ? newPoints : [{ point: '', point_french: '' }] })
  }

  const updatePoint = (index: number, field: 'point' | 'point_french', value: string) => {
    const updatedPoints = [...formData.points]
    updatedPoints[index] = { ...updatedPoints[index], [field]: value }
    setFormData({ ...formData, points: updatedPoints })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Service name is required')
      return
    }

    // For new services, require image file
    if (!selectedService && !selectedFile) {
      setError('Please select an image')
      return
    }

    // Validate points
    const validPoints = formData.points.filter((p) => p.point.trim() !== '')
    if (!selectedService && validPoints.length === 0) {
      setError('Please add at least one service point')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      if (selectedService) {
        // Update existing service (name and name_french only)
        await updateService({
          id: selectedService.id,
          name: formData.name,
          name_french: formData.name_french || undefined,
        })
        
        // Save any new points that were added
        const newPoints = validPoints.filter((p) => p.point.trim() !== '')
        if (newPoints.length > 0) {
          // Save each new point
          for (const point of newPoints) {
            await saveServicePoint({
              service_id: selectedService.id,
              point: point.point,
              point_french: point.point_french || undefined,
            })
          }
        }
        
        // Refresh the service data to show newly added points
        try {
          const updatedService = await getServiceById(selectedService.id)
          const mappedService = mapBackendToFrontend(updatedService)
          setSelectedService(mappedService)
        } catch (err) {
          console.error('Error refreshing service data:', err)
        }
        
        setSuccessMessage('Service updated successfully')
        setEditDialogOpen(false)
        setFormData({ name: '', name_french: '', points: [{ point: '', point_french: '' }] })
        setRefreshKey((k) => k + 1)
      } else {
        // Create new service
        const payload = {
          image: selectedFile!,
          name: formData.name,
          name_french: formData.name_french || undefined,
          points: validPoints.map((p) => ({
            point: p.point,
            point_french: p.point_french || undefined,
          })),
        }

        await createService(payload)
        setSuccessMessage('Service created successfully')
        setAddDialogOpen(false)
        setRefreshKey((k) => k + 1)
      }
      setFormData({ name: '', name_french: '', points: [{ point: '', point_french: '' }] })
      setSelectedService(null)
      setSelectedFile(null)
    } catch (err: any) {
      console.error('Error saving service:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveImage = async () => {
    if (!selectedService || !selectedFile) {
      setError('Please select an image')
      return
    }

    try {
      setSaving(true)
      setError(null)
      await updateServiceImage(selectedService.id, selectedFile)
      setSuccessMessage('Service image updated successfully')
      setImageDialogOpen(false)
      setSelectedFile(null)
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Error updating service image:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update service image')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePoint = async () => {
    if (!selectedPoint) return

    if (!pointFormData.point.trim()) {
      setError('Point text is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      await updateServicePoint({
        pointId: selectedPoint.id,
        point: pointFormData.point,
        point_french: pointFormData.point_french || undefined,
      })
      setSuccessMessage('Service point updated successfully')
      setPointDialogOpen(false)
      setSelectedPoint(null)
      setPointFormData({ point: '', point_french: '' })
      
      // Refresh the selected service data if edit dialog is open
      if (selectedService) {
        try {
          const updatedService = await getServiceById(selectedService.id)
          const mappedService = mapBackendToFrontend(updatedService)
          setSelectedService(mappedService)
        } catch (err) {
          console.error('Error refreshing service data:', err)
        }
      }
      
      setRefreshKey((k) => k + 1)
    } catch (err: any) {
      console.error('Error updating service point:', err)
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to update service point')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: number) => {
    const service = services.find((s) => s.id === id)
    setConfirmDialogConfig({
      title: 'Delete Service',
      message: `Are you sure you want to delete "${service?.name || 'this service'}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setDeleting(true)
          setError(null)
          await deleteService(id)
          setServices(services.filter((s) => s.id !== id))
          setSuccessMessage('Service deleted successfully')
          setConfirmDialogOpen(false)
          setConfirmDialogConfig(null)
        } catch (err: any) {
          console.error('Error deleting service:', err)
          setError(err?.response?.data?.error?.message || err?.message || 'Failed to delete service')
          setConfirmDialogOpen(false)
          setConfirmDialogConfig(null)
        } finally {
          setDeleting(false)
        }
      },
    })
    setConfirmDialogOpen(true)
  }

  const handleDeletePoint = (pointId: number) => {
    const point = selectedService?.points.find((p) => p.id === pointId)
    setConfirmDialogConfig({
      title: 'Delete Service Point',
      message: `Are you sure you want to delete this service point? "${point?.point || 'This point'}" will be permanently removed.`,
      onConfirm: async () => {
        try {
          setDeleting(true)
          setError(null)
          await deleteServicePoint(pointId)
          setSuccessMessage('Service point deleted successfully')
          
          // Refresh the selected service data if edit dialog is open
          if (selectedService) {
            try {
              const updatedService = await getServiceById(selectedService.id)
              const mappedService = mapBackendToFrontend(updatedService)
              setSelectedService(mappedService)
            } catch (err) {
              console.error('Error refreshing service data:', err)
            }
          }
          
          setRefreshKey((k) => k + 1)
          setConfirmDialogOpen(false)
          setConfirmDialogConfig(null)
        } catch (err: any) {
          console.error('Error deleting service point:', err)
          setError(err?.response?.data?.error?.message || err?.message || 'Failed to delete service point')
          setConfirmDialogOpen(false)
          setConfirmDialogConfig(null)
        } finally {
          setDeleting(false)
        }
      },
    })
    setConfirmDialogOpen(true)
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Services Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Service
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No services found. Click "Add Service" to create one.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Service (EN)</TableCell>
                  <TableCell>Service (FR)</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      {service.nameFrench ? (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {service.nameFrench}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={service.imageUrl}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        <ServiceIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Chip label={`${service.points.length} point(s)`} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(service)}
                          color="primary"
                          title="Edit Service"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleImageUpdate(service)}
                          color="primary"
                          title="Update Image"
                        >
                          <UploadIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(service.id)}
                          color="error"
                          title="Delete Service"
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

      {/* Service Points Display Dialog */}
      {selectedService && (
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false)
            setSelectedService(null)
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Service Points - {selectedService.name}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Service Name (EN)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Service Name (FR)"
                value={formData.name_french}
                onChange={(e) => setFormData({ ...formData, name_french: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Existing Service Points
                </Typography>
              </Box>
              {selectedService.points.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No points available
                </Typography>
              ) : (
                <Box sx={{ mb: 3 }}>
                  {selectedService.points.map((point) => (
                    <Card key={point.id} sx={{ p: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {point.point}
                          </Typography>
                          {point.point_french && (
                            <Typography variant="caption" color="text.secondary">
                              {point.point_french}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handlePointEdit(point)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePoint(point.id)}
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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Add New Service Points
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addPoint} variant="outlined" disabled={saving}>
                  Add Point
                </Button>
              </Box>
              {formData.points.map((point, index) => (
                <Card key={index} sx={{ p: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">New Point {index + 1}</Typography>
                    {formData.points.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removePoint(index)}
                        color="error"
                        disabled={saving}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    label="Point (EN) *"
                    value={point.point}
                    onChange={(e) => updatePoint(index, 'point', e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    disabled={saving}
                  />
                  <TextField
                    fullWidth
                    label="Point (FR)"
                    value={point.point_french}
                    onChange={(e) => updatePoint(index, 'point_french', e.target.value)}
                    disabled={saving}
                  />
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
            <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ backgroundColor: 'primary.main' }}>
              {saving ? <CircularProgress size={20} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Service Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Service Name (EN) *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Service Name (FR)"
              value={formData.name_french}
              onChange={(e) => setFormData({ ...formData, name_french: e.target.value })}
              sx={{ mb: 2 }}
              disabled={saving}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
              disabled={saving}
            >
              {saving ? 'Uploading...' : 'Upload Image *'}
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {selectedFile && (
              <Box
                component="img"
                src={URL.createObjectURL(selectedFile)}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Service Points
              </Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addPoint} variant="outlined" disabled={saving}>
                Add Point
              </Button>
            </Box>
            {formData.points.map((point, index) => (
              <Card key={index} sx={{ p: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Point {index + 1}</Typography>
                  {formData.points.length > 1 && (
                    <IconButton size="small" onClick={() => removePoint(index)} color="error" disabled={saving}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  fullWidth
                  label="Point (EN) *"
                  value={point.point}
                  onChange={(e) => updatePoint(index, 'point', e.target.value)}
                  sx={{ mb: 1 }}
                  required
                  disabled={saving}
                />
                <TextField
                  fullWidth
                  label="Point (FR)"
                  value={point.point_french}
                  onChange={(e) => updatePoint(index, 'point_french', e.target.value)}
                  disabled={saving}
                />
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !formData.name || !selectedFile} sx={{ backgroundColor: 'primary.main' }}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Service Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
              disabled={saving}
            >
              {saving ? 'Uploading...' : 'Select New Image'}
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {selectedFile && (
              <Box
                component="img"
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
            {selectedService && !selectedFile && (
              <Box
                component="img"
                src={selectedService.imageUrl}
                alt="Current"
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveImage} variant="contained" disabled={saving || !selectedFile} sx={{ backgroundColor: 'primary.main' }}>
            {saving ? <CircularProgress size={20} /> : 'Update Image'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Point Dialog */}
      <Dialog open={pointDialogOpen} onClose={() => {
        setPointDialogOpen(false)
        setSelectedPoint(null)
        setPointFormData({ point: '', point_french: '' })
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Service Point</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Point (EN) *"
              value={pointFormData.point}
              onChange={(e) => setPointFormData({ ...pointFormData, point: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Point (FR)"
              value={pointFormData.point_french}
              onChange={(e) => setPointFormData({ ...pointFormData, point_french: e.target.value })}
              disabled={saving}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPointDialogOpen(false)
            setSelectedPoint(null)
            setPointFormData({ point: '', point_french: '' })
          }} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSavePoint} variant="contained" disabled={saving} sx={{ backgroundColor: 'primary.main' }}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'error.light',
              color: 'error.main',
            }}
          >
            <WarningIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {confirmDialogConfig?.title || 'Confirm Action'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {confirmDialogConfig?.message || 'Are you sure you want to proceed?'}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 1,
          }}
        >
          <Button
            onClick={() => {
              setConfirmDialogOpen(false)
              setConfirmDialogConfig(null)
            }}
            variant="outlined"
            disabled={deleting}
            sx={{
              minWidth: 100,
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (confirmDialogConfig?.onConfirm) {
                confirmDialogConfig.onConfirm()
              }
            }}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{
              minWidth: 100,
              backgroundColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
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

export default ServicesManagement
