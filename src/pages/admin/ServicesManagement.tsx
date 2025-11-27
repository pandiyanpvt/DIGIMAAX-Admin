import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

// Service types from DIGIMAAX
const SERVICE_TYPES = [
  'CCTV Installation',
  'LED Board Designing',
  '3D Printed Model Creation',
  'POS System Setup',
  'Server Storage Solution',
  'Interior Designing',
  'Product Advertisement',
  'Wall Art & Wall Designs',
]

interface Package {
  name: string
  description: string
  price: string
}

interface Service {
  id: number
  name: string
  tagline: string
  serviceType: string
  description: string
  packages: Package[]
  includedItems: string[]
}

const sampleServices: Service[] = [
  {
    id: 1,
    name: 'CCTV Installation',
    tagline: 'Secure your premises with professional surveillance',
    serviceType: 'CCTV Installation',
    description: 'Professional CCTV installation services to secure your business or home. We provide high-quality cameras and DVR systems with expert installation.',
    packages: [
      { name: 'Basic', description: '2 Cameras + DVR', price: '€25,000' },
      { name: 'Standard', description: '4 Cameras + DVR', price: '€45,000' },
      { name: 'Premium', description: '8 Cameras + DVR', price: '€75,000' },
    ],
    includedItems: [
      'Free site inspection',
      'Installation',
      'Warranty',
      'Support',
    ],
  },
]

function ServicesManagement() {
  const [services, setServices] = useState<Service[]>(sampleServices)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    serviceType: '',
    description: '',
    packages: [{ name: 'Basic', description: '', price: '' }] as Package[],
    includedItems: [''] as string[],
  })

  const handleAdd = () => {
    setEditingService(null)
    setFormData({
      name: '',
      tagline: '',
      serviceType: '',
      description: '',
      packages: [{ name: 'Basic', description: '', price: '' }],
      includedItems: [''],
    })
    setDialogOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      tagline: service.tagline,
      serviceType: service.serviceType,
      description: service.description,
      packages: service.packages.length > 0 ? service.packages : [{ name: 'Basic', description: '', price: '' }],
      includedItems: service.includedItems.length > 0 ? service.includedItems : [''],
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...formData,
                packages: formData.packages.filter(p => p.name && p.description && p.price),
                includedItems: formData.includedItems.filter(item => item.trim() !== ''),
              }
            : s
        )
      )
    } else {
      setServices([
        ...services,
        {
          id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
          ...formData,
          packages: formData.packages.filter(p => p.name && p.description && p.price),
          includedItems: formData.includedItems.filter(item => item.trim() !== ''),
        },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter((s) => s.id !== id))
    }
  }

  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [...formData.packages, { name: '', description: '', price: '' }],
    })
  }

  const removePackage = (index: number) => {
    setFormData({
      ...formData,
      packages: formData.packages.filter((_, i) => i !== index),
    })
  }

  const updatePackage = (index: number, field: keyof Package, value: string) => {
    const updatedPackages = [...formData.packages]
    updatedPackages[index] = { ...updatedPackages[index], [field]: value }
    setFormData({ ...formData, packages: updatedPackages })
  }

  const addIncludedItem = () => {
    setFormData({
      ...formData,
      includedItems: [...formData.includedItems, ''],
    })
  }

  const removeIncludedItem = (index: number) => {
    setFormData({
      ...formData,
      includedItems: formData.includedItems.filter((_, i) => i !== index),
    })
  }

  const updateIncludedItem = (index: number, value: string) => {
    const updatedItems = [...formData.includedItems]
    updatedItems[index] = value
    setFormData({ ...formData, includedItems: updatedItems })
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
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Service
          </Button>
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Tagline</TableCell>
                <TableCell>Packages</TableCell>
                <TableCell>Included Items</TableCell>
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
                  <TableCell>
                    <Chip label={service.serviceType} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {service.tagline}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service.packages.length} package(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service.includedItems.length} item(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(service)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(service.id)}
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
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          }
        }}
      >
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Short header tagline about the service"
                required
              />
            </Grid>
              <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceType}
                  label="Service Type"
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  {SERVICE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About this service"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what the service is, why customers need it, and key benefits."
                required
              />
            </Grid>

              <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Packages / Pricing</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addPackage}
                  variant="outlined"
                >
                  Add Package
                </Button>
              </Box>
              {formData.packages.map((pkg, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Package {index + 1}</Typography>
                    {formData.packages.length > 1 && (
                      <IconButton size="small" onClick={() => removePackage(index)} color="error">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Package Name"
                        value={pkg.name}
                        onChange={(e) => updatePackage(index, 'name', e.target.value)}
                        placeholder="e.g., Basic, Standard, Premium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        value={pkg.description}
                        onChange={(e) => updatePackage(index, 'description', e.target.value)}
                        placeholder="e.g., 2 Cameras + DVR"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Price"
                        value={pkg.price}
                        onChange={(e) => updatePackage(index, 'price', e.target.value)}
                        placeholder="e.g., €25,000"
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Grid>

              <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">What's Included</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addIncludedItem}
                  variant="outlined"
                >
                  Add Item
                </Button>
              </Box>
              {formData.includedItems.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={item}
                    onChange={(e) => updateIncludedItem(index, e.target.value)}
                    placeholder="e.g., Free site inspection"
                  />
                  {formData.includedItems.length > 1 && (
                    <IconButton onClick={() => removeIncludedItem(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default ServicesManagement

