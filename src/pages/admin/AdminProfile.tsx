import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { Edit as EditIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn, MoreHoriz as MoreIcon } from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import { useState } from 'react'

const initialProfile = {
  name: 'Alex Carter',
  role: 'Super Admin',
  email: 'alex.carter@digimaax.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  status: 'Active',
  memberSince: 'March 2022',
}

function AdminProfile() {
  const [profileData, setProfileData] = useState(initialProfile)
  const [draftProfile, setDraftProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)

  const startEditing = () => {
    setDraftProfile(profileData)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraftProfile(profileData)
    setIsEditing(false)
  }

  const handleSave = () => {
    setProfileData(draftProfile)
    setIsEditing(false)
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                      sx={{ borderRadius: 2, minWidth: 120 }}
                    >
                      Save changes
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
        </Grid>

        <Grid item xs={12} md={6}>
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
        </Grid>

      </Grid>
    </PageContainer>
  )
}

export default AdminProfile

