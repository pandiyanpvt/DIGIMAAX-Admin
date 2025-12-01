import { useState } from 'react'
import { Alert, Box, Button, Container, Paper, TextField, Typography, Link as MuiLink, InputAdornment, IconButton, Fade } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../../api/auth'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  // Get email from location state (set by ForgotPassword page) or use empty string
  const emailFromState = (location.state as any)?.email || ''

  const [form, setForm] = useState({ 
    email: emailFromState,
    otp: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFeedback(null)

    if (!form.email.trim()) {
      setFeedback({ type: 'error', message: 'Email is required.' })
      return
    }
    if (!form.otp.trim()) {
      setFeedback({ type: 'error', message: 'OTP is required.' })
      return
    }
    if (!form.password || !form.confirmPassword) {
      setFeedback({ type: 'error', message: 'Please fill in both password fields.' })
      return
    }
    if (form.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' })
      return
    }
    if (form.password !== form.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    try {
      const message = await resetPassword({ 
        email: form.email.trim(), 
        otp: form.otp.trim(), 
        newPassword: form.password 
      })
      setFeedback({ type: 'success', message: message || 'Password reset successfully.' })
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || err?.message || 'Unable to reset password.' })
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
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              borderRadius: 4,
              overflow: 'hidden',
              background: '#28045C',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              minHeight: { xs: 'auto', md: '600px' },
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Left Panel - Welcome Section */}
            <Box
              sx={{
                flex: { xs: 'none', md: '1' },
                background: '#28045C',
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: { xs: '300px', md: 'auto' },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/DIGIMAAX_LOGO-01 1.png"
                  alt="DIGIMAAX Logo"
                  sx={{
                    width: { xs: 120, sm: 150, md: 180 },
                    height: 'auto',
                    mb: 3,
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  WELCOME
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    color: 'rgba(255, 255, 255, 0.95)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  DIGIMAAX ADMIN
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    maxWidth: '400px',
                    textAlign: 'center',
                  }}
                >
                  Reset your password to regain access to your admin panel. 
                  Enter your email, OTP, and new password to continue.
                </Typography>
              </Box>
            </Box>

            {/* Right Panel - Reset Password Form */}
            <Box
              sx={{
                flex: { xs: 'none', md: '1' },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.2)' },
                p: { xs: 4, sm: 5, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  color: '#1f2937',
                  mb: 1,
                }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  mb: 4,
                  fontSize: '0.95rem',
                }}
              >
                Enter your email, the OTP sent to your email, and your new password.
              </Typography>
              {feedback && (
                <Alert
                  severity={feedback.type}
                  sx={{
                    mb: 2.5,
                    borderRadius: 2,
                  }}
                >
                  {feedback.message}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  fullWidth
                  variant="outlined"
                  disabled={!!emailFromState}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#1f2937',
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#1f2937',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(229, 231, 235, 0.8)',
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.85)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.9)',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.1)',
                        '& fieldset': {
                          borderColor: '#3d0a6b',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#3d0a6b',
                      },
                    },
                  }}
                />
                <TextField
                  label="OTP Code"
                  type="text"
                  value={form.otp}
                  onChange={handleChange('otp')}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Enter the 6-digit OTP"
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#1f2937',
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#1f2937',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(229, 231, 235, 0.8)',
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.85)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.9)',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.1)',
                        '& fieldset': {
                          borderColor: '#3d0a6b',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#3d0a6b',
                      },
                    },
                  }}
                />
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: '#9ca3af',
                            '&:hover': {
                              color: '#3d0a6b',
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
                      color: '#1f2937',
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#1f2937',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(229, 231, 235, 0.8)',
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.85)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.9)',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.1)',
                        '& fieldset': {
                          borderColor: '#3d0a6b',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#3d0a6b',
                      },
                    },
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{
                            color: '#9ca3af',
                            '&:hover': {
                              color: '#3d0a6b',
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
                      color: '#1f2937',
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '& input': {
                        color: '#1f2937',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(229, 231, 235, 0.8)',
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.85)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.9)',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 0 0 3px rgba(61, 10, 107, 0.1)',
                        '& fieldset': {
                          borderColor: '#3d0a6b',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#3d0a6b',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !form.email || !form.otp}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: '#3d0a6b',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(61, 10, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#28045C',
                      boxShadow: '0 6px 20px rgba(61, 10, 107, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: '#9ca3af',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#6b7280' }}>
                Back to{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: '#3d0a6b',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  login
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

