import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { Edit as EditIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn, MoreHoriz as MoreIcon } from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateCurrentUserProfile, type User } from '../../api/users'
import { getCurrentUser } from '../../constants/roles'
import { setAdminAuthToken } from '../../api/client'
import { format } from 'date-fns'

interface ProfileData {
  name: string
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  location: string
  status: string
  memberSince: string
}

const getInitialProfile = (): ProfileData => ({
  name: '',
  firstName: '',
  lastName: '',
  role: 'Admin',
  email: '',
  phone: '',
  location: '',
  status: 'Active',
  memberSince: '',
})

function AdminProfile() {
  const [profileData, setProfileData] = useState<ProfileData>(getInitialProfile())
  const [draftProfile, setDraftProfile] = useState<ProfileData>(getInitialProfile())
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Map backend user data to frontend profile format
  const mapUserToProfile = (user: User): ProfileData => {
    const currentUser = getCurrentUser()
    const memberSince = user.created_at 
      ? format(new Date(user.created_at), 'MMMM yyyy')
      : 'N/A'
    
    return {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.roleName || currentUser?.roleName || 'Admin',
      email: user.email || '',
      phone: user.phoneNumber || '',
      location: '', // Location is not stored in backend, keep as empty or local storage
      status: user.is_verified ? 'Active' : 'Inactive',
      memberSince,
    }
  }

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const user = await getCurrentUserProfile()
        const profile = mapUserToProfile(user)
        setProfileData(profile)
        setDraftProfile(profile)
      } catch (err: any) {
        console.error('Error fetching profile:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to load profile')
        // Fallback to localStorage user data if API fails
        const currentUser = getCurrentUser()
        if (currentUser) {
          const profile = mapUserToProfile(currentUser as User)
          setProfileData(profile)
          setDraftProfile(profile)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const startEditing = () => {
    setDraftProfile(profileData)
    setIsEditing(true)
    setError(null)
    setSuccessMessage(null)
  }

  const cancelEditing = () => {
    setDraftProfile(profileData)
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      // Prepare update payload
      const updatePayload: {
        firstName?: string
        lastName?: string
        email?: string
        phoneNumber?: string
      } = {}

      if (draftProfile.firstName !== profileData.firstName) {
        updatePayload.firstName = draftProfile.firstName
      }
      if (draftProfile.lastName !== profileData.lastName) {
        updatePayload.lastName = draftProfile.lastName
      }
      if (draftProfile.email !== profileData.email) {
        updatePayload.email = draftProfile.email
      }
      if (draftProfile.phone !== profileData.phone) {
        updatePayload.phoneNumber = draftProfile.phone
      }

      if (Object.keys(updatePayload).length === 0) {
        setIsEditing(false)
        return
      }

      await updateCurrentUserProfile(updatePayload)
      
      // Refetch the full profile to get all fields including roleName and created_at
      const refreshedUser = await getCurrentUserProfile()
      const updatedProfile = mapUserToProfile(refreshedUser)
      
      // Preserve location if it was changed (frontend-only field)
      updatedProfile.location = draftProfile.location

      // Update localStorage with refreshed user data
      const stored = localStorage.getItem('adminAuth')
      if (stored) {
        const { token } = JSON.parse(stored)
        setAdminAuthToken(token, refreshedUser)
      }

      setProfileData(updatedProfile)
      setDraftProfile(updatedProfile)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageContainer sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </PageContainer>
    )
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
        <Box sx={{ width: '100%' }}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(8,47,73,0.95) 0%, rgba(15,23,42,0.95) 60%)',
              border: '1px solid rgba(56,189,248,0.15)',
              boxShadow: '0 30px 80px rgba(8,47,73,0.45)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 3,
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                color: '#f0f9ff',
              }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <Avatar
                  src=""
                  sx={{
                    width: { xs: 80, sm: 92 },
                    height: { xs: 80, sm: 92 },
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)',
                    border: '3px solid rgba(241,245,249,0.25)',
                    flexShrink: 0,
                  }}
                >
                  {profileData.name.charAt(0)}
                </Avatar>
                <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    {profileData.name}
                  </Typography>
                  <Typography sx={{ color: '#cbd5f5', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {profileData.role}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    <Chip
                      label={profileData.status}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16,185,129,0.2)',
                        color: '#34d399',
                        border: '1px solid rgba(16,185,129,0.4)',
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={`Member since ${profileData.memberSince}`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(59,130,246,0.2)',
                        color: '#93c5fd',
                        border: '1px solid rgba(59,130,246,0.4)',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack 
                direction="row" 
                spacing={2}
                alignItems="center"
                sx={{ 
                  width: { xs: '100%', md: 'auto' },
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  mt: { xs: 2, md: 0 },
                }}
              >
                {isEditing ? (
                  <>
                    <Button 
                      variant="contained" 
                      onClick={handleSave} 
                      disabled={saving}
                      sx={{ borderRadius: 2, minWidth: 120 }}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save changes'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={cancelEditing} 
                      sx={{ borderRadius: 2, minWidth: 100 }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2, minWidth: 140 }}
                    onClick={startEditing}
                  >
                    Update profile
                  </Button>
                )}
                <IconButton
                  sx={{
                    color: '#f0f9ff',
                    border: '1px solid rgba(241,245,249,0.35)',
                    borderRadius: 2,
                    ml: { xs: 'auto', md: 0 },
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />
          </Card>
        </Box>

        <Box 
          sx={{ 
            width: { xs: '100%', md: 'calc(50% - 12px)' },
            alignSelf: { xs: 'stretch', md: 'flex-start' }
          }}
        >
          <Card
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              color: '#f8fafc',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#e2e8f0', fontSize: '1.1rem' }}>
              Contact Information
            </Typography>
            <Stack spacing={2.5}>
              {isEditing && (
                <>
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    alignItems="flex-start"
                    sx={{ width: '100%' }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 1,
                      }}
                    >
                      <EditIcon sx={{ fontSize: 22, color: '#8b5cf6' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', gap: 2 }}>
                      <TextField
                        label="First Name"
                        variant="filled"
                        size="small"
                        fullWidth
                        value={draftProfile.firstName}
                        onChange={(event) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            firstName: event.target.value,
                            name: `${event.target.value} ${prev.lastName}`.trim(),
                          }))
                        }
                        sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                        InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                        InputProps={{ sx: { color: '#f8fafc' } }}
                      />
                      <TextField
                        label="Last Name"
                        variant="filled"
                        size="small"
                        fullWidth
                        value={draftProfile.lastName}
                        onChange={(event) =>
                          setDraftProfile((prev) => ({
                            ...prev,
                            lastName: event.target.value,
                            name: `${prev.firstName} ${event.target.value}`.trim(),
                          }))
                        }
                        sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                        InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                        InputProps={{ sx: { color: '#f8fafc' } }}
                      />
                    </Box>
                  </Stack>
                </>
              )}
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems={isEditing ? 'flex-start' : 'center'}
                sx={{ width: '100%' }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 22, color: '#38bdf8' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <TextField
                      label="Email"
                      variant="filled"
                      size="small"
                      fullWidth
                      type="email"
                      value={draftProfile.email}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f8fafc', wordBreak: 'break-word' }}>
                        {profileData.email}
                      </Typography>
                    </>
                  )}
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems={isEditing ? 'flex-start' : 'center'}
                sx={{ width: '100%' }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(74, 222, 128, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 22, color: '#4ade80' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <TextField
                      label="Phone"
                      variant="filled"
                      size="small"
                      fullWidth
                      type="tel"
                      value={draftProfile.phone}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                        Phone
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                        {profileData.phone}
                      </Typography>
                    </>
                  )}
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems={isEditing ? 'flex-start' : 'center'}
                sx={{ width: '100%' }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(248, 113, 113, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <LocationOn sx={{ fontSize: 22, color: '#f87171' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <TextField
                      label="Location"
                      variant="filled"
                      size="small"
                      fullWidth
                      value={draftProfile.location}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          location: event.target.value,
                        }))
                      }
                      sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                        Location
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                        {profileData.location}
                      </Typography>
                    </>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Box>

      </Box>
    </PageContainer>
  )
}

export default AdminProfile

