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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getUserBookings, getCurrentUserId } from '../../utils/mockData'
import { type MockBooking } from '../../utils/mockData'

function MyBookings() {
  const [bookings, setBookings] = useState<MockBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<MockBooking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<MockBooking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const userId = getCurrentUserId()

  useEffect(() => {
    if (userId) {
      const userBookings = getUserBookings(userId)
      setBookings(userBookings)
      setFilteredBookings(userBookings)
    }
  }, [userId])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter))
    }
  }, [statusFilter, bookings])

  const handleView = (booking: MockBooking) => {
    setSelectedBooking(booking)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      case 'confirmed':
      case 'in-progress':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            My Bookings
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterIcon />}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="quoted">Quoted</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service Type</TableCell>
                <TableCell>Service Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Quote Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No bookings found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.serviceType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {booking.serviceDetails}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        size="small"
                        color={getStatusColor(booking.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {booking.quoteAmount ? (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          LKR {booking.quoteAmount.toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Pending Quote
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleView(booking)}
                        color="primary"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* View Booking Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Service Type
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedBooking.serviceType}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Service Details
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBooking.serviceDetails}
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedBooking.status}
                      color={getStatusColor(selectedBooking.status) as any}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Booking Date
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {new Date(selectedBooking.bookingDate).toLocaleString()}
                  </Typography>
                </Box>
                {selectedBooking.quoteAmount && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Quote Amount
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: 'success.main' }}>
                      LKR {selectedBooking.quoteAmount.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              {selectedBooking.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                    {selectedBooking.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default MyBookings

