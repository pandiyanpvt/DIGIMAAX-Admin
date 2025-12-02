import { useState, useEffect } from 'react'
import { Alert, Box, Button, Container, Paper, TextField, Typography, Link as MuiLink, MenuItem, Select, FormControl, InputLabel, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { registerAdmin } from '../../api/auth'
import { getAllUserRoles, type UserRole } from '../../api/userRoles'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phoneNumber: '', 
    password: '', 
    confirmPassword: '',
    userRoleId: 1 // Default to Admin role (ID 1)
  })
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Try to fetch user roles, but don't fail if it requires auth
    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const roles = await getAllUserRoles()
        setUserRoles(roles.filter(role => role.is_active))
      } catch (err) {
        // If fetching roles fails (e.g., requires auth), use default
        console.warn('Could not fetch user roles, using default')
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [])

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: any } }) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phoneNumber.trim() || !form.password || !form.confirmPassword) {
      setError('All fields are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email.')
      return
    }
    if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(form.phoneNumber.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      const message = await registerAdmin({ 
        firstName: form.firstName.trim(), 
        lastName: form.lastName.trim(),
        email: form.email.trim(), 
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        userRoleId: form.userRoleId
      })
      setSuccess(message || 'Registration successful. Please check your email for verification OTP.')
      setTimeout(() => navigate('/verify-email', { 
        replace: true,
        state: { email: form.email.trim() }
      }), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: '#28045C',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src="/DIGIMAAX_LOGO-01 1.png"
              alt="DIGIMAAX Logo"
              sx={{
                width: 120,
                height: 'auto',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(61, 10, 107, 0.3))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                color: '#ffffff',
              }}
            >
              Create Account
            </Typography>
          </Box>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: 'rgba(244, 67, 54, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                color: '#ffcdd2',
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                bgcolor: 'rgba(76, 175, 80, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                color: '#c8e6c9',
              }}
            >
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={handleChange('firstName')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      borderWidth: '1px',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                      '& fieldset': {
                        borderColor: 'rgba(61, 10, 107, 0.9)',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(61, 10, 107, 0.9)',
                    },
                  },
                }}
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={handleChange('lastName')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      borderWidth: '1px',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                      '& fieldset': {
                        borderColor: 'rgba(61, 10, 107, 0.9)',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(61, 10, 107, 0.9)',
                    },
                  },
                }}
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    borderWidth: '1px',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(61, 10, 107, 0.9)',
                      borderWidth: '2px',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(61, 10, 107, 0.9)',
                  },
                },
              }}
            />
            <TextField
              label="Phone Number"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange('phoneNumber')}
              required
              fullWidth
              placeholder="+1234567890"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    borderWidth: '1px',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(61, 10, 107, 0.9)',
                      borderWidth: '2px',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(61, 10, 107, 0.9)',
                  },
                },
              }}
            />
            {userRoles.length > 0 && (
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      borderWidth: '1px',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                      '& fieldset': {
                        borderColor: 'rgba(61, 10, 107, 0.9)',
                        borderWidth: '2px',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(61, 10, 107, 0.9)',
                    },
                  },
                }}
              >
                <InputLabel>User Role</InputLabel>
                <Select
                  value={form.userRoleId}
                  onChange={(e) => handleChange('userRoleId')({ target: { value: Number(e.target.value) } })}
                  label="User Role"
                  disabled={loadingRoles}
                >
                  {userRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          color: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    borderWidth: '1px',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(61, 10, 107, 0.9)',
                      borderWidth: '2px',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(61, 10, 107, 0.9)',
                  },
                },
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&:hover': {
                          color: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    borderWidth: '1px',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.2)',
                    '& fieldset': {
                      borderColor: 'rgba(61, 10, 107, 0.9)',
                      borderWidth: '2px',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(61, 10, 107, 0.9)',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2,
                background: '#3d0a6b',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(61, 10, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#28045C',
                  boxShadow: '0 6px 20px rgba(61, 10, 107, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            Already have an account?{' '}
            <MuiLink
              component={Link}
              to="/login"
              sx={{
                color: '#3d0a6b',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  color: '#28045C',
                  textDecoration: 'underline',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Login
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

