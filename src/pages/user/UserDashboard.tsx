import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  Chip,
  Grid,
} from '@mui/material'
import {
  BookOnline as BookingsIcon,
  PendingActions as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getUserBookings, getCurrentUserId, type MockBooking } from '../../utils/mockData'

function UserDashboard() {
  const [bookings, setBookings] = useState<MockBooking[]>([])
  const userId = getCurrentUserId()

  useEffect(() => {
    if (userId) {
      const userBookings = getUserBookings(userId)
      setBookings(userBookings)
    }
  }, [userId])

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed' || b.status === 'in-progress').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  const recentBookings = bookings.slice(0, 5)

  return (
    <PageContainer sx={{ p: 4, minHeight: '100vh' }}>
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          p: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#f8fafc' }}>
          Welcome to Your Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(59,130,246,0.26) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BookingsIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                    Total Bookings
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(251,191,36,0.26) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PendingIcon sx={{ fontSize: 40, color: '#fbbf24' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                    Pending
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(52,211,153,0.26) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CompletedIcon sx={{ fontSize: 40, color: '#34d399' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                    Completed
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(248,113,113,0.26) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CancelledIcon sx={{ fontSize: 40, color: '#f87171' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {stats.cancelled}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                    Cancelled
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Bookings */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e2e8f0' }}>
          Recent Bookings
        </Typography>
        {recentBookings.length === 0 ? (
          <Card
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              No bookings found. Your bookings will appear here.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentBookings.map((booking) => (
              <Card
                key={booking.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0', mb: 1 }}>
                      {booking.serviceType}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5f5', mb: 1 }}>
                      {booking.serviceDetails}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip
                      label={booking.status}
                      size="small"
                      color={
                        booking.status === 'completed'
                          ? 'success'
                          : booking.status === 'pending'
                          ? 'warning'
                          : booking.status === 'cancelled'
                          ? 'error'
                          : 'info'
                      }
                    />
                    {booking.quoteAmount && (
                      <Typography variant="body2" sx={{ color: '#34d399', fontWeight: 600 }}>
                        LKR {booking.quoteAmount.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Card>
    </PageContainer>
  )
}

export default UserDashboard

