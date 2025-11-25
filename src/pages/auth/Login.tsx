import { useState } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  Alert, 
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Fade,
  Slide
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdmin, loginDeveloper } from '../../api/auth'
import { getAllUserRoles } from '../../api/userRoles'
import { getCurrentUserRole } from '../../constants/roles'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.')
      return
    }
    setLoading(true)
    try {
      let loginResult
      
      // Try admin login first (for admin role)
      try {
        loginResult = await loginAdmin({ email: email.trim(), password })
      } catch (adminError: any) {
        const errorMessage = adminError?.response?.data?.message || adminError?.message || ''
        
        // If admin login fails with "not an admin" error, try developer login (for developer/superadmin role)
        if (errorMessage.includes('not an admin') || 
            errorMessage.includes('Invalid credentials or not an admin')) {
          try {
            // Try developer login for superadmin/developer role
            loginResult = await loginDeveloper({ email: email.trim(), password })
          } catch (devError: any) {
            // Both admin and developer login failed - show the most specific error
            const devErrorMessage = devError?.response?.data?.message || devError?.message || ''
            if (devErrorMessage.includes('not a developer') || devErrorMessage.includes('not an admin')) {
              // User doesn't have the right role
              throw new Error('Access denied. This account does not have admin or developer privileges.')
            } else if (devErrorMessage.includes('not verified') || devErrorMessage.includes('Email address not verified')) {
              throw new Error('Email address not verified. Please verify your account before logging in.')
            } else {
              // Show the developer error if it's more specific, otherwise show admin error
              throw devError
            }
          }
        } else if (errorMessage.includes('not verified') || errorMessage.includes('Email address not verified')) {
          // Email not verified - don't try developer login
          throw new Error('Email address not verified. Please verify your account before logging in.')
        } else if (errorMessage.includes('Invalid credentials')) {
          // Invalid credentials - try developer login as fallback (user might be a developer)
          try {
            loginResult = await loginDeveloper({ email: email.trim(), password })
          } catch (devError: any) {
            // Both failed - show credentials error
            throw new Error('Invalid email or password. Please check your credentials and try again.')
          }
        } else {
          // Other admin login error - try developer login as fallback
          try {
            loginResult = await loginDeveloper({ email: email.trim(), password })
          } catch (devError: any) {
            // Both failed - show the original admin error
            throw adminError
          }
        }
      }
      
      setSuccess(loginResult?.message || 'Login successful. Redirecting...')
      
      // Fetch user roles from backend after successful login
      try {
        const userRoles = await getAllUserRoles()
        console.log('User roles fetched:', userRoles)
        // Store user roles in localStorage for later use if needed
        if (userRoles && userRoles.length > 0) {
          localStorage.setItem('userRoles', JSON.stringify(userRoles))
        }
      } catch (roleError: any) {
        console.warn('Could not fetch user roles:', roleError?.response?.data?.message || roleError?.message)
        // Don't block login if role fetch fails
      }
      
      setTimeout(() => {
        const role = getCurrentUserRole()

        // Allow admin and developer (superadmin) to access this panel
        if (role === 'user') {
          setError('Access denied. This panel is only for administrators and developers.')
          // Clear auth token
          localStorage.removeItem('adminAuth')
          return
        }

        // Both admin and developer can access - redirect to dashboard
        const dashboardRoute = '/admin-dashboard'
        navigate(dashboardRoute, { replace: true })
        // Trigger dashboard view in AdminLayout
        window.dispatchEvent(new CustomEvent('admin:navigate', { detail: 'dashboard' }))
      }, 800)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid credentials')
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
        background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 25%, #24243e 50%, #0F0C29 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 25s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translate(0, 0) rotate(0deg) scale(1)',
              opacity: 0.6,
            },
            '33%': {
              transform: 'translate(30px, -30px) rotate(120deg) scale(1.1)',
              opacity: 0.8,
            },
            '66%': {
              transform: 'translate(-30px, 30px) rotate(240deg) scale(0.9)',
              opacity: 0.7,
            },
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          animation: 'pulse 15s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 0.8 },
          },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, px: 2 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: `
                0 8px 32px 0 rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 2px 20px rgba(102, 126, 234, 0.1) inset
              `,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: `
                  0 12px 48px 0 rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                  0 4px 30px rgba(102, 126, 234, 0.15) inset
                `,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6), transparent)',
                animation: 'shimmer 3s ease-in-out infinite',
                '@keyframes shimmer': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' },
                },
              },
            }}
          >
          <Slide direction="down" in timeout={600}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box
                component="img"
                src="/DIGIMAAX_LOGO-01 1.png"
                alt="DIGIMAAX Logo"
                sx={{
                  width: { xs: 100, sm: 140 },
                  height: 'auto',
                  mb: 2.5,
                  filter: 'drop-shadow(0 8px 16px rgba(102, 126, 234, 0.4))',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.08) translateY(-2px)',
                    filter: 'drop-shadow(0 12px 24px rgba(102, 126, 234, 0.6))',
                  },
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  textAlign: 'center',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px',
                  mb: 0.5,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                }}
              >
                Sign in to access your admin panel
              </Typography>
            </Box>
          </Slide>
          <Fade in={!!error || !!success}>
            <Box sx={{ mb: 2.5 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(244, 67, 54, 0.4)',
                    color: '#ffcdd2',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#ffcdd2',
                    },
                  }}
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(76, 175, 80, 0.4)',
                    color: '#c8e6c9',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#c8e6c9',
                    },
                  }}
                >
                  {success}
                </Alert>
              )}
            </Box>
          </Fade>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Slide direction="right" in timeout={700}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiFilledInput-root': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:before': {
                      borderBottom: 'none',
                    },
                    '&:after': {
                      borderBottom: '2px solid rgba(102, 126, 234, 0.8)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      '&:before': {
                        borderBottom: 'none',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&.Mui-focused': {
                      color: 'rgba(102, 126, 234, 0.9)',
                    },
                  },
                }}
              />
            </Slide>
            <Slide direction="right" in timeout={900}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            color: 'rgba(255, 255, 255, 0.9)',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiFilledInput-root': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:before': {
                      borderBottom: 'none',
                    },
                    '&:after': {
                      borderBottom: '2px solid rgba(102, 126, 234, 0.8)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      '&:before': {
                        borderBottom: 'none',
                      },
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&.Mui-focused': {
                      color: 'rgba(102, 126, 234, 0.9)',
                    },
                  },
                }}
              />
            </Slide>
            <Slide direction="up" in timeout={1100}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px 0 rgba(102, 126, 234, 0.4), 0 0 0 0 rgba(102, 126, 234, 0)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    boxShadow: '0 8px 30px 0 rgba(102, 126, 234, 0.6), 0 0 0 4px rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-3px)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 'none',
                    transform: 'none',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Slide>
          </Box>
          <Slide direction="up" in timeout={1300}>
            <Box sx={{ mt: 3.5, display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'center' }}>
              <MuiLink
                component={Link}
                to="/forgot-password"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    transform: 'translateX(-50%) scaleX(0)',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.8), transparent)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.95)',
                    '&::after': {
                      transform: 'translateX(-50%) scaleX(1)',
                    },
                  },
                  transition: 'color 0.3s ease',
                }}
              >
                Forgot password?
              </MuiLink>
            </Box>
          </Slide>
        </Paper>
      </Fade>
      </Container>
    </Box>
  )
}
