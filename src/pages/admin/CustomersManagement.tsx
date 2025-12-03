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
  Avatar,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const sampleCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    bookingsCount: 5,
    lastBookingDate: '2024-01-15',
    vehicles: ['Sedan - ABC123', 'SUV - XYZ789'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    bookingsCount: 2,
    lastBookingDate: '2024-01-10',
    vehicles: ['Sedan - DEF456'],
  },
]

function CustomersManagement() {
  const [customers, setCustomers] = useState(sampleCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (customer: any) => {
    setSelectedCustomer(customer)
    setViewDialogOpen(true)
  }

  const handleEdit = (customer: any) => {
    setSelectedCustomer({ ...customer })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (selectedCustomer) {
      setCustomers(
        customers.map((c) => (c.id === selectedCustomer.id ? selectedCustomer : c))
      )
      setEditDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const handleDelete = (id: number) => {
    setCustomerToDelete(id)
    setConfirmDialogOpen(true)
  }

  const confirmDelete = () => {
    if (customerToDelete === null) return
    setCustomers(customers.filter((c) => c.id !== customerToDelete))
    setConfirmDialogOpen(false)
    setCustomerToDelete(null)
  }

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Phone', 'Bookings', 'Last Booking'].join(','),
      ...customers.map((c) =>
        [c.id, c.name, c.email, c.phone, c.bookingsCount, c.lastBookingDate].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleImport = () => {
    // Handle CSV import
    alert('Import functionality - CSV file upload would be implemented here')
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Customers Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleImport}
            >
              Import
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Export
            </Button>
          </Box>
        </Box>

        <TextField
          placeholder="Search customers..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, minWidth: { xs: '100%', sm: 300 } }}
          fullWidth={false}
        />

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Last Booking</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: '#667eea' }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{customer.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={customer.bookingsCount} size="small" />
                  </TableCell>
                  <TableCell>{customer.lastBookingDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(customer)}
                        color="primary"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(customer)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customer.id)}
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

      {/* View Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
          }
        }}
      >
        <DialogTitle>Customer Profile</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6">{selectedCustomer.name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedCustomer.email}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{selectedCustomer.phone}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Bookings
                </Typography>
                <Typography variant="body1">{selectedCustomer.bookingsCount}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Last Booking
                </Typography>
                <Typography variant="body1">{selectedCustomer.lastBookingDate}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Vehicles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedCustomer.vehicles.map((vehicle: string, idx: number) => (
                    <Chip key={idx} label={vehicle} size="small" />
                  ))}
                </Box>
                </Grid>
                </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={selectedCustomer.name}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedCustomer.phone}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })
                  }
                />
                </Grid>
                </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customers.find((c) => c.id === customerToDelete)?.name || 'this customer'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDialogOpen(false)
          setCustomerToDelete(null)
        }}
        loading={deleting}
      />
    </PageContainer>
  )
}

export default CustomersManagement

