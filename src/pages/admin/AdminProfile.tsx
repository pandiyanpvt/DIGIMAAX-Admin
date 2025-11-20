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
  badges: ['Security Cleared', 'Full Access', 'Beta Tester'],
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
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                px: 4,
                py: 4,
                color: '#f0f9ff',
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  src=""
                  sx={{
                    width: 92,
                    height: 92,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #9333ea 100%)',
                    border: '3px solid rgba(241,245,249,0.25)',
                  }}
                >
                  {profileData.name.charAt(0)}
                </Avatar>
                <Stack spacing={0.5}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {profileData.name}
                  </Typography>
                  <Typography sx={{ color: '#cbd5f5' }}>{profileData.role}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={profileData.status}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16,185,129,0.2)',
                        color: '#34d399',
                        border: '1px solid rgba(16,185,129,0.4)',
                      }}
                    />
                    <Chip
                      label={`Member since ${profileData.memberSince}`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(59,130,246,0.2)',
                        color: '#93c5fd',
                        border: '1px solid rgba(59,130,246,0.4)',
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2}>
                {isEditing ? (
                  <>
                    <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2 }}>
                      Save changes
                    </Button>
                    <Button variant="outlined" onClick={cancelEditing} sx={{ borderRadius: 2 }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2 }}
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
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              color: '#f8fafc',
              height: '100%',
            }}
          >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 20, color: '#38bdf8' }} />
                  {isEditing ? (
                    <TextField
                      label="Email"
                      variant="filled"
                      size="small"
                      value={draftProfile.email}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      sx={{ minWidth: 220, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <Typography variant="body2">{profileData.email}</Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 20, color: '#4ade80' }} />
                  {isEditing ? (
                    <TextField
                      label="Phone"
                      variant="filled"
                      size="small"
                      value={draftProfile.phone}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      sx={{ minWidth: 220, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <Typography variant="body2">{profileData.phone}</Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOn sx={{ fontSize: 20, color: '#f87171' }} />
                  {isEditing ? (
                    <TextField
                      label="Location"
                      variant="filled"
                      size="small"
                      value={draftProfile.location}
                      onChange={(event) =>
                        setDraftProfile((prev) => ({
                          ...prev,
                          location: event.target.value,
                        }))
                      }
                      sx={{ minWidth: 220, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                      InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                      InputProps={{ sx: { color: '#f8fafc' } }}
                    />
                  ) : (
                    <Typography variant="body2">{profileData.location}</Typography>
                  )}
                </Stack>
              </Stack>
            <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.2)' }} />
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>
              Badges
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                label="Badges (comma separated)"
                variant="filled"
                size="small"
                value={draftProfile.badges.join(', ')}
                onChange={(event) =>
                  setDraftProfile((prev) => ({
                    ...prev,
                    badges: event.target.value
                      .split(',')
                      .map((badge) => badge.trim())
                      .filter(Boolean),
                  }))
                }
                sx={{ backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 1 }}
                InputLabelProps={{ sx: { color: '#cbd5f5' } }}
                InputProps={{ sx: { color: '#f8fafc' } }}
              />
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {profileData.badges.map((badge) => (
                  <Chip
                    key={badge}
                    label={badge}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(96, 165, 250, 0.2)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      color: '#bfdbfe',
                    }}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </Grid>

      </Grid>
    </PageContainer>
  )
}

export default AdminProfile

