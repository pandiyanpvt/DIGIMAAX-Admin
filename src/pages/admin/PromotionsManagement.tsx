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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

const samplePromotions = [
  {
    id: 1,
    title: 'Summer Special',
    description: '20% off on all services',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    discountType: 'percent',
    discountValue: 20,
    voucherCode: 'SUMMER20',
    status: 'active',
    usageCount: 45,
  },
  {
    id: 2,
    title: 'New Customer Discount',
    description: '€10 off first booking',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    discountType: 'amount',
    discountValue: 10,
    voucherCode: 'NEW10',
    status: 'active',
    usageCount: 12,
  },
]

function PromotionsManagement() {
  const [promotions, setPromotions] = useState(samplePromotions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percent',
    discountValue: '',
    voucherCode: '',
    status: 'active',
  })

  const generateVoucherCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const handleAdd = () => {
    setEditingPromo(null)
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      discountType: 'percent',
      discountValue: '',
      voucherCode: generateVoucherCode(),
      status: 'active',
    })
    setDialogOpen(true)
  }

  const handleEdit = (promo: any) => {
    setEditingPromo(promo)
    setFormData({
      title: promo.title,
      description: promo.description,
      startDate: promo.startDate,
      endDate: promo.endDate,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      voucherCode: promo.voucherCode,
      status: promo.status,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingPromo) {
      setPromotions(
        promotions.map((p) =>
          p.id === editingPromo.id
            ? {
                ...p,
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                usageCount: p.usageCount,
              }
            : p
        )
      )
    } else {
      setPromotions([
        ...promotions,
        {
          id: promotions.length + 1,
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          usageCount: 0,
        },
      ])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter((p) => p.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setPromotions(
      promotions.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
      )
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Promotions / Offers Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Create Promotion
          </Button>
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Voucher Code</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {promo.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell>
                    {promo.discountType === 'percent'
                      ? `${promo.discountValue}%`
                      : `€${typeof promo.discountValue === 'number' ? promo.discountValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : promo.discountValue}`}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={promo.voucherCode} size="small" />
                      <IconButton size="small" onClick={() => navigator.clipboard.writeText(promo.voucherCode)}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {promo.startDate} to {promo.endDate}
                  </TableCell>
                  <TableCell>{promo.usageCount} bookings</TableCell>
                  <TableCell>
                    <Switch
                      checked={promo.status === 'active'}
                      onChange={() => toggleStatus(promo.id)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(promo)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(promo.id)}
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
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          }
        }}
      >
        <DialogTitle>{editingPromo ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
                </Grid>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.discountType}
                  label="Discount Type"
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <MenuItem value="percent">Percentage</MenuItem>
                  <MenuItem value="amount">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Discount Value"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
                </Grid>
              <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Voucher Code"
                value={formData.voucherCode}
                onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => setFormData({ ...formData, voucherCode: generateVoucherCode() })}
                    >
                      Generate
                    </Button>
                  ),
                }}
              />
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

export default PromotionsManagement

