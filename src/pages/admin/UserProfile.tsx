import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Chip,
} from '@mui/material'
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  type User,
  type UpdateCurrentUserProfilePayload,
} from '../../api/users'
import { getCurrentUser } from '../../constants/roles'

function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await getCurrentUserProfile()
        setUser(userData)
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
        })
      } catch (err: any) {
        console.error('Error fetching profile:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to load profile')
        // Fallback to localStorage user data
        const localUser = getCurrentUser()
        if (localUser) {
          setFormData({
            firstName: localUser.firstName || '',
            lastName: localUser.lastName || '',
            email: localUser.email || '',
            phoneNumber: localUser.phoneNumber || '',
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError('First name, last name, and email are required')
        return
      }

      const payload: UpdateCurrentUserProfilePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      }

      const updated = await updateCurrentUserProfile(payload)
      setUser(updated)
      setSuccessMessage('Profile updated successfully!')

      // Update localStorage with new user data
      try {
        const stored = localStorage.getItem('adminAuth')
        if (stored) {
          const authData = JSON.parse(stored)
          authData.user = { ...authData.user, ...updated }
          localStorage.setItem('adminAuth', JSON.stringify(authData))
        }
      } catch (err) {
        console.error('Error updating localStorage:', err)
      }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || ''
    const last = formData.lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            User Profile
          </Typography>
        </Box>

        {(error || successMessage) && (
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError(null)
              setSuccessMessage(null)
            }}
            sx={{ mb: 3 }}
          >
            {error || successMessage}
          </Alert>
        )}

        {/* Profile Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 4,
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              fontSize: { xs: '2rem', sm: '2.5rem' },
              bgcolor: 'primary.main',
            }}
          >
            {getInitials()}
          </Avatar>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {formData.firstName} {formData.lastName}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                icon={<EmailIcon />}
                label={formData.email}
                size="small"
                variant="outlined"
                sx={{ mb: { xs: 0.5, sm: 0 } }}
              />
              {formData.phoneNumber && (
                <Chip
                  icon={<PhoneIcon />}
                  label={formData.phoneNumber}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            {user?.roleName && (
              <Chip
                label={user.roleName}
                size="small"
                color="primary"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Form */}
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              disabled={saving}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{ backgroundColor: 'primary.main' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Card>

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

export default UserProfile

