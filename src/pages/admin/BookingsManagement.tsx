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
  Chip,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Paper,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import PageContainer from '../../components/common/PageContainer'
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Note as NoteIcon,
  Email as EmailIcon,
} from '@mui/icons-material'

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

// Sample booking/quote request data
const sampleBookings = [
  {
    id: 1,
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+94771234567',
    address: '123 Main Street, Colombo 05',
    serviceType: 'CCTV Installation',
    message: 'Need CCTV installation for my office building. Looking for 8 cameras with DVR system.',
    date: '2024-01-15',
    status: 'confirmed',
    paymentStatus: 'pending',
    quotedAmount: 'LKR 75,000',
    notes: 'Customer prefers morning installation',
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+94771234568',
    address: '456 Business Park, Kandy',
    serviceType: 'LED Board Designing',
    message: 'Need LED board design for my shop front. Size: 10ft x 4ft',
    date: '2024-01-16',
    status: 'pending',
    paymentStatus: 'pending',
    quotedAmount: '',
    notes: '',
  },
  {
    id: 3,
    customerName: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+94771234569',
    address: '789 Industrial Zone, Galle',
    serviceType: 'Interior Designing',
    message: 'Looking for interior design services for new restaurant. Need complete design package.',
    date: '2024-01-14',
    status: 'quoted',
    paymentStatus: 'pending',
    quotedAmount: 'LKR 150,000',
    notes: 'Follow up required',
  },
]

const statusColors: Record<string, string> = {
  pending: '#ff9800',
  quoted: '#2196f3',
  confirmed: '#4caf50',
  completed: '#4caf50',
  cancelled: '#f44336',
}

const paymentColors: Record<string, string> = {
  paid: '#4caf50',
  pending: '#ff9800',
  refunded: '#f44336',
}

function BookingsManagement() {
  const [bookings, setBookings] = useState(sampleBookings)
  const [filteredBookings, setFilteredBookings] = useState(sampleBookings)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    date: '' as string,
    search: '',
  })
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: '',
    type: 'custom' as 'confirm' | 'reminder' | 'cancel' | 'custom',
  })

  const handleFilter = () => {
    let filtered = [...bookings]

    if (filters.status !== 'all') {
      filtered = filtered.filter((b) => b.status === filters.status)
    }

    if (filters.date) {
      filtered = filtered.filter((b) => b.date === filters.date)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.customerName.toLowerCase().includes(searchLower) ||
          b.email.toLowerCase().includes(searchLower) ||
          b.serviceType.toLowerCase().includes(searchLower) ||
          b.phone.toLowerCase().includes(searchLower)
      )
    }

    setFilteredBookings(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [filters, bookings])

  const handleView = (booking: any) => {
    setSelectedBooking(booking)
    setViewDialogOpen(true)
  }


  const handleEdit = (booking: any) => {
    setSelectedBooking(booking)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (selectedBooking) {
      setBookings(
        bookings.map((b) => (b.id === selectedBooking.id ? selectedBooking : b))
      )
      setEditDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleDelete = (booking: any) => {
    setSelectedBooking(booking)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedBooking) {
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id))
      setDeleteDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  // Email template generators
  const getConfirmEmailTemplate = (booking: any) => ({
    to: booking.email,
    subject: `Quote Request Confirmed - ${booking.serviceType}`,
    message: `Dear ${booking.customerName},

Your quote request has been confirmed!

Request Details:
- Service Type: ${booking.serviceType}
- Request Date: ${booking.date}
- Address: ${booking.address}
${booking.quotedAmount ? `- Quoted Amount: ${booking.quotedAmount}` : ''}

We will review your requirements and get back to you soon. If you have any questions or need to make changes, please contact us.

Thank you for choosing DIGIMAAX Solutions!

Best regards,
DIGIMAAX Team`,
    type: 'confirm' as const,
  })

  const getReminderEmailTemplate = (booking: any) => ({
    to: booking.email,
    subject: `Reminder: Your Quote Request - ${booking.serviceType}`,
    message: `Dear ${booking.customerName},

This is a friendly reminder about your quote request.

Request Details:
- Service Type: ${booking.serviceType}
- Request Date: ${booking.date}
- Address: ${booking.address}
${booking.quotedAmount ? `- Quoted Amount: ${booking.quotedAmount}` : ''}

We are working on your quote and will contact you soon. If you have any questions or need to update your requirements, please contact us.

Thank you for your patience!

Best regards,
DIGIMAAX Team`,
    type: 'reminder' as const,
  })

  const getCancelEmailTemplate = (booking: any) => ({
    to: booking.email,
    subject: `Quote Request Cancelled - ${booking.serviceType}`,
    message: `Dear ${booking.customerName},

We regret to inform you that your quote request has been cancelled.

Request Details:
- Service Type: ${booking.serviceType}
- Request Date: ${booking.date}
- Address: ${booking.address}

If you have any questions or would like to submit a new request, please contact us. We apologize for any inconvenience.

Thank you for your understanding.

Best regards,
DIGIMAAX Team`,
    type: 'cancel' as const,
  })

  const handleEmail = (booking: any, type: 'confirm' | 'reminder' | 'cancel' | 'custom' = 'custom') => {
    setSelectedBooking(booking)
    let template
    switch (type) {
      case 'confirm':
        template = getConfirmEmailTemplate(booking)
        break
      case 'reminder':
        template = getReminderEmailTemplate(booking)
        break
      case 'cancel':
        template = getCancelEmailTemplate(booking)
        break
      default:
        template = {
          to: booking.email,
          subject: `Quote Request ${booking.id} - ${booking.serviceType}`,
          message: `Dear ${booking.customerName},\n\nRegarding your quote request...`,
          type: 'custom' as const,
        }
    }
    setEmailData(template)
    setEmailDialogOpen(true)
  }

  const handleSendEmail = () => {
    // Here you would integrate with your email service/API
    console.log('Sending email:', emailData)
    // Example: await sendEmailAPI(emailData)
    alert(`Email sent to ${emailData.to}`)
    setEmailDialogOpen(false)
  }

  const handleExport = () => {
    // Helper function to escape CSV values (wrap in quotes if contains comma, quote, or newline)
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Format date to ensure it's visible in Excel
    // Convert YYYY-MM-DD to a readable format that Excel will display correctly
    const formatDate = (dateString: string): string => {
      if (!dateString || dateString.trim() === '') return ''
      try {
        const [year, month, day] = dateString.split('-')
        if (year && month && day) {
          // Format as DD-MMM-YYYY (e.g., "15-Jan-2024") which is more readable and Excel-friendly
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const monthIndex = parseInt(month, 10) - 1
          const monthName = monthNames[monthIndex] || month
          return `${day}-${monthName}-${year}`
        }
        return dateString
      } catch (error) {
        return dateString
      }
    }

    const csv = [
      ['ID', 'Customer', 'Email', 'Phone', 'Address', 'Service Type', 'Date', 'Status', 'Payment', 'Quoted Amount'].join(','),
      ...filteredBookings.map((b) => {
        const formattedDate = formatDate(b.date || '')
        return [
          escapeCSV(b.id),
          escapeCSV(b.customerName),
          escapeCSV(b.email),
          escapeCSV(b.phone),
          escapeCSV(b.address),
          escapeCSV(b.serviceType),
          escapeCSV(formattedDate),
          escapeCSV(b.status),
          escapeCSV(b.paymentStatus),
          escapeCSV(b.quotedAmount || ''),
        ].join(',')
      }),
    ].join('\n')

    // Add BOM for UTF-8 to ensure Excel opens it correctly
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        {/* Header and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Bookings Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search bookings..."
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="quoted">Quoted</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            size="small"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 180,
              '& input[type="date"]::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
                cursor: 'pointer',
              },
              '& input[type="date"]::-webkit-inner-spin-button': {
                display: 'none',
              },
            }}
          />
          {filters.date && (
            <Button
              size="small"
              onClick={() => setFilters({ ...filters, date: '' })}
              sx={{ textTransform: 'none' }}
            >
              Clear Date
            </Button>
          )}
        </Box>

        {/* Bookings Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Quoted Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={booking.serviceType} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {booking.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColors[booking.status] || '#757575',
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.paymentStatus}
                      size="small"
                      sx={{
                        backgroundColor: paymentColors[booking.paymentStatus] || '#757575',
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {booking.quotedAmount || 'Not quoted'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(booking)}
                        color="primary"
                        title="View Details"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(booking)}
                        color="primary"
                        title="Edit Booking"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEmail(booking, 'custom')}
                        color="primary"
                        title="Send Email"
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(booking)}
                        color="error"
                        title="Delete Booking"
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
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            bgcolor: '#1e1e1e'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, bgcolor: '#1e1e1e' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewIcon sx={{ color: '#4f46e5' }} />
            <Typography variant="h6" component="span" sx={{ color: '#ffffff' }}>Booking Details</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setViewDialogOpen(false)}
            sx={{ color: '#b0b0b0', '&:hover': { bgcolor: '#3d3d3d' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: '#1e1e1e' }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }} gutterBottom>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Customer Name
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                        {selectedBooking.customerName}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Email
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#ffffff' }}>{selectedBooking.email}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Phone
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#ffffff' }}>{selectedBooking.phone}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }} gutterBottom>
                    Booking Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid xs={12} sm={6}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#b0b0b0' }}>
                        Service Type
                      </Typography>
                      <Chip 
                        label={selectedBooking.serviceType} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#4f46e5',
                          color: '#ffffff',
                          fontWeight: 500,
                        }} 
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Address
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#ffffff' }}>{selectedBooking.address}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Request Date
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#ffffff' }}>
                        {selectedBooking.date}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MoneyIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          Quoted Amount
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ color: '#4f46e5' }}>
                        {selectedBooking.quotedAmount || 'Not quoted yet'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#b0b0b0' }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedBooking.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[selectedBooking.status],
                          color: 'white',
                          textTransform: 'capitalize',
                          fontWeight: 500,
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#b0b0b0' }}>
                        Payment Status
                      </Typography>
                      <Chip
                        label={selectedBooking.paymentStatus}
                        size="small"
                        sx={{
                          backgroundColor: paymentColors[selectedBooking.paymentStatus],
                          color: 'white',
                          textTransform: 'capitalize',
                          fontWeight: 500,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {selectedBooking.message && (
                <Grid xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <NoteIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                      <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>
                        Message / Requirements
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#ffffff' }}>
                      {selectedBooking.message}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              {selectedBooking.notes && (
                <Grid xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <NoteIcon fontSize="small" sx={{ color: '#b0b0b0' }} />
                      <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>
                        Admin Notes
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#ffffff' }}>
                      {selectedBooking.notes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <Box sx={{ 
          p: 2.5, 
          bgcolor: '#1e1e1e',
          borderTop: '1px solid #3d3d3d',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            onClick={() => setViewDialogOpen(false)} 
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderColor: '#3d3d3d',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                color: '#ffffff',
              },
              px: 3,
              py: 1,
            }}
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              setViewDialogOpen(false)
              handleEdit(selectedBooking)
            }} 
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
              },
              px: 3,
              py: 1,
            }}
          >
            Edit Booking
          </Button>
        </Box>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            bgcolor: '#1e1e1e'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, bgcolor: '#1e1e1e' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ color: '#4f46e5' }} />
            <Typography variant="h6" component="span" sx={{ color: '#ffffff' }}>Edit Booking</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#b0b0b0', '&:hover': { bgcolor: '#3d3d3d' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: '#1e1e1e' }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Request Date"
                  type="date"
                  value={selectedBooking.date}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '& input': {
                        color: '#ffffff',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quoted Amount"
                  value={selectedBooking.quotedAmount || ''}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, quotedAmount: e.target.value })
                  }
                  placeholder="e.g., LKR 75,000"
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '& input': {
                        color: '#ffffff',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                    '& .MuiSelect-select': {
                      color: '#ffffff',
                    },
                  }}
                >
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={selectedBooking.serviceType}
                    label="Service Type"
                    onChange={(e) =>
                      setSelectedBooking({ ...selectedBooking, serviceType: e.target.value })
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#2d2d2d',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: '#3d3d3d',
                            },
                            '&.Mui-selected': {
                              bgcolor: '#4f46e5',
                              '&:hover': {
                                bgcolor: '#4338ca',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {SERVICE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                    '& .MuiSelect-select': {
                      color: '#ffffff',
                    },
                  }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedBooking.status}
                    label="Status"
                    onChange={(e) =>
                      setSelectedBooking({ ...selectedBooking, status: e.target.value })
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#2d2d2d',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: '#3d3d3d',
                            },
                            '&.Mui-selected': {
                              bgcolor: '#4f46e5',
                              '&:hover': {
                                bgcolor: '#4338ca',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="quoted">Quoted</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={selectedBooking.address || ''}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, address: e.target.value })
                  }
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '& input': {
                        color: '#ffffff',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Message / Requirements"
                  value={selectedBooking.message || ''}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, message: e.target.value })
                  }
                  placeholder="Customer's message or requirements..."
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '& textarea': {
                        color: '#ffffff',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Admin Notes"
                  value={selectedBooking.notes || ''}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, notes: e.target.value })
                  }
                  placeholder="Add any internal notes or instructions..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#2d2d2d',
                      color: '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4f46e5',
                      },
                      '& textarea': {
                        color: '#ffffff',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4f46e5',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#888888',
                      opacity: 1,
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <Box sx={{ 
          p: 2.5, 
          bgcolor: '#1e1e1e',
          borderTop: '1px solid #3d3d3d',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderColor: '#3d3d3d',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                color: '#ffffff',
              },
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            startIcon={<CheckCircleIcon />}
            sx={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
              },
              px: 3,
              py: 1,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            bgcolor: '#1e1e1e'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, bgcolor: '#1e1e1e' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6" component="span" sx={{ color: '#ffffff' }}>Delete Booking</Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#b0b0b0', '&:hover': { bgcolor: '#3d3d3d' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: '#1e1e1e' }}>
          {selectedBooking && (
            <Box>
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3,
                  bgcolor: '#3d2d1e',
                  color: '#ff9800',
                  '& .MuiAlert-icon': {
                    color: '#ff9800',
                  },
                }}
              >
                Are you sure you want to delete this booking? This action cannot be undone.
              </Alert>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#2d2d2d', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }} gutterBottom>
                  Booking Details
                </Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, color: '#ffffff' }}>
                    <strong style={{ color: '#b0b0b0' }}>Customer:</strong> {selectedBooking.customerName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, color: '#ffffff' }}>
                    <strong style={{ color: '#b0b0b0' }}>Service Type:</strong> {selectedBooking.serviceType}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, color: '#ffffff' }}>
                    <strong style={{ color: '#b0b0b0' }}>Date:</strong> {selectedBooking.date}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    <strong style={{ color: '#b0b0b0' }}>Quoted Amount:</strong> {selectedBooking.quotedAmount || 'Not quoted'}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <Box sx={{ 
          p: 2.5, 
          bgcolor: '#1e1e1e',
          borderTop: '1px solid #3d3d3d',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderColor: '#3d3d3d',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                color: '#ffffff',
              },
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            startIcon={<DeleteIcon />}
            sx={{
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                boxShadow: '0 6px 20px rgba(244, 67, 54, 0.5)',
              },
              px: 3,
              py: 1,
            }}
          >
            Delete Booking
          </Button>
        </Box>
      </Dialog>

      {/* Email Dialog */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={() => setEmailDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            bgcolor: '#1e1e1e'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, bgcolor: '#1e1e1e' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ color: '#4f46e5' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="span" sx={{ color: '#ffffff' }}>Send Email to Customer</Typography>
              {emailData.type !== 'custom' && (
                <Chip
                  label={emailData.type.charAt(0).toUpperCase() + emailData.type.slice(1)}
                  size="small"
                  sx={{ 
                    textTransform: 'capitalize',
                    bgcolor: emailData.type === 'confirm' ? '#4caf50' : emailData.type === 'reminder' ? '#2196f3' : '#f44336',
                    color: '#ffffff',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setEmailDialogOpen(false)}
            sx={{ color: '#b0b0b0', '&:hover': { bgcolor: '#3d3d3d' } }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, bgcolor: '#1e1e1e' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="To"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                disabled={emailData.type !== 'custom'}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#2d2d2d',
                    color: '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '& input': {
                      color: '#ffffff',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#1a1a1a',
                      '& input': {
                        color: '#666666',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4f46e5',
                  },
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#2d2d2d',
                    color: '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '& input': {
                      color: '#ffffff',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4f46e5',
                  },
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Message"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#2d2d2d',
                    color: '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '& textarea': {
                      color: '#ffffff',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b0b0b0',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#4f46e5',
                  },
                }}
              />
            </Grid>
            {emailData.type !== 'custom' && (
              <Grid xs={12}>
                <Button
                  size="small"
                  onClick={() => {
                    if (selectedBooking) {
                      const template =
                        emailData.type === 'confirm'
                          ? getConfirmEmailTemplate(selectedBooking)
                          : emailData.type === 'reminder'
                          ? getReminderEmailTemplate(selectedBooking)
                          : getCancelEmailTemplate(selectedBooking)
                      setEmailData(template)
                    }
                  }}
                  sx={{ 
                    textTransform: 'none',
                    color: '#4f46e5',
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.1)',
                    },
                  }}
                >
                  Reset to Template
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <Box sx={{ 
          p: 2.5, 
          bgcolor: '#1e1e1e',
          borderTop: '1px solid #3d3d3d',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            onClick={() => setEmailDialogOpen(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{
              borderColor: '#3d3d3d',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#4f46e5',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
                color: '#ffffff',
              },
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
              },
              px: 3,
              py: 1,
            }}
          >
            Send Email
          </Button>
        </Box>
      </Dialog>
    </PageContainer>
  )
}

export default BookingsManagement

