import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  Alert, 
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Fade,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdmin, loginDeveloper } from '../../api/auth'
import { getAllUserRoles } from '../../api/userRoles'
import { getCurrentUserRole } from '../../constants/roles'
import { getAdminAuthToken, clearAdminAuthToken } from '../../api/client'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [autoLoggingIn, setAutoLoggingIn] = useState(false)

  // Auto-login if "Remember Me" was checked and token exists
  // Also redirect if user is already authenticated (has active session)
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const authData = getAdminAuthToken()
        if (authData?.token) {
          // Auto-login if "Remember Me" was checked (persists across browser sessions)
          // OR if user has an active session (token exists in sessionStorage)
          const hasRememberMe = authData?.rememberMe === true
          const hasActiveSession = sessionStorage.getItem('adminAuth') !== null
          
          if (hasRememberMe || hasActiveSession) {
            setAutoLoggingIn(true)
            // Verify token is still valid by checking user role
            const role = getCurrentUserRole()
            if (role && role !== 'user') {
              // Token is valid, redirect to dashboard
              navigate('/admin-dashboard', { replace: true })
              window.dispatchEvent(new CustomEvent('admin:navigate', { detail: 'dashboard' }))
            } else {
              // Token is invalid or user doesn't have access, clear it
              clearAdminAuthToken()
              setAutoLoggingIn(false)
            }
          }
        }
      } catch (err) {
        // If auto-login fails, just clear the token and show login form
        clearAdminAuthToken()
        setAutoLoggingIn(false)
      }
    }
    checkAutoLogin()
  }, [navigate])

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
        loginResult = await loginAdmin({ email: email.trim(), password }, rememberMe)
      } catch (adminError: any) {
        const errorMessage = adminError?.response?.data?.message || adminError?.message || ''
        
        // If admin login fails with "not an admin" error, try developer login (for developer/superadmin role)
        if (errorMessage.includes('not an admin') || 
            errorMessage.includes('Invalid credentials or not an admin')) {
          try {
            // Try developer login for superadmin/developer role
            loginResult = await loginDeveloper({ email: email.trim(), password }, rememberMe)
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
            loginResult = await loginDeveloper({ email: email.trim(), password }, rememberMe)
          } catch (devError: any) {
            // Both failed - show credentials error
            throw new Error('Invalid email or password. Please check your credentials and try again.')
          }
        } else {
          // Other admin login error - try developer login as fallback
          try {
            loginResult = await loginDeveloper({ email: email.trim(), password }, rememberMe)
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
        // Store user roles in localStorage for later use if needed
        if (userRoles && userRoles.length > 0) {
          localStorage.setItem('userRoles', JSON.stringify(userRoles))
        }
      } catch (roleError: any) {
        // Don't block login if role fetch fails
      }
      
      setTimeout(() => {
        const role = getCurrentUserRole()

        // Allow admin and developer (superadmin) to access this panel
        if (role === 'user') {
          setError('Access denied. This panel is only for administrators and developers.')
          // Clear auth token
          clearAdminAuthToken()
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

  // Show loading state during auto-login
  if (autoLoggingIn) {
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
        <Typography>Logging you in...</Typography>
      </Box>
    )
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
                  Sign in to access your admin panel and manage your digital services with ease. 
                  Your gateway to comprehensive administration tools.
                </Typography>
              </Box>
            </Box>

            {/* Right Panel - Sign In Form */}
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
                Sign in
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  mb: 4,
                  fontSize: '0.95rem',
                }}
              >
                Enter your credentials to access your account
              </Typography>
              <Fade in={!!error || !!success}>
                <Box sx={{ mb: 2.5 }}>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      {success}
                    </Alert>
                  )}
                </Box>
              </Fade>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="User Name"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="User Name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#9ca3af' }} />
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
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#9ca3af' }} />
                      </InputAdornment>
                    ),
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#3d0a6b',
                          '&.Mui-checked': {
                            color: '#3d0a6b',
                          },
                        }}
                      />
                    }
                    label="Remember me"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        color: '#374151',
                      },
                    }}
                  />
                  <MuiLink
                    component={Link}
                    to="/forgot-password"
                    sx={{
                      color: '#3d0a6b',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </MuiLink>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
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
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}
