import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Avatar,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Lock as LockIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { getUserById, getCurrentUserId } from '../../utils/mockData'
import { type MockUser } from '../../utils/mockData'

function UserProfile() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const userId = getCurrentUserId()

  useEffect(() => {
    if (userId) {
      const userData = getUserById(userId)
      if (userData) {
        setUser(userData)
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        })
      }
    }
  }, [userId])

  const handleSaveProfile = () => {
    // Simulate save
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    // Simulate password change
    setPasswordSuccess(true)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  if (!user) {
    return (
      <PageContainer sx={{ p: 4 }}>
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="body1">Loading profile...</Typography>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, backgroundColor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        {/* Profile Information */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Profile Information
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Save Profile
          </Button>
        </Box>

        {/* Change Password */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Change Password
        </Typography>
        {passwordSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Password changed successfully!
          </Alert>
        )}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleChangePassword}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Change Password
          </Button>
        </Box>

        {/* Account Status */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Account Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {user.status === 'active' ? 'Active' : 'Inactive'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email Verified: {user.isVerified ? 'Yes' : 'No'}
          </Typography>
          {user.lastLogin && (
            <Typography variant="body2" color="text.secondary">
              Last Login: {new Date(user.lastLogin).toLocaleString()}
            </Typography>
          )}
        </Box>
      </Card>
    </PageContainer>
  )
}

export default UserProfile

