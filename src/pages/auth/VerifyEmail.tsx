import { useState } from 'react'
import { Alert, Box, Button, Container, Paper, TextField, Typography, Link as MuiLink } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { verifyEmail } from '../../api/auth'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  // Get email from location state (set by Register page) or use empty string
  const emailFromState = (location.state as any)?.email || ''

  const [form, setForm] = useState({ 
    email: emailFromState,
    otp: '' 
  })
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
    if (form.otp.trim().length !== 6) {
      setFeedback({ type: 'error', message: 'OTP must be 6 digits.' })
      return
    }

    setLoading(true)
    try {
      const message = await verifyEmail({ 
        email: form.email.trim(), 
        otp: form.otp.trim()
      })
      setFeedback({ type: 'success', message: message || 'Email verified successfully.' })
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || err?.message || 'Unable to verify email.' })
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/DIGIMAAX_LOGO-01 1.png"
              alt="DIGIMAAX Logo"
              sx={{
                width: { xs: 120, sm: 150 },
                height: 'auto',
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))',
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
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              Verify Email
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            Enter the 6-digit OTP code sent to your email address.
          </Typography>
          {feedback && (
            <Alert
              severity={feedback.type}
              sx={{
                mb: 2,
                bgcolor: feedback.type === 'error' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${feedback.type === 'error' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
                color: feedback.type === 'error' ? '#ffcdd2' : '#c8e6c9',
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
              disabled={!!emailFromState}
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
              label="OTP Code"
              type="text"
              value={form.otp}
              onChange={handleChange('otp')}
              required
              fullWidth
              placeholder="Enter 6-digit OTP"
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
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
              disabled={loading || !form.email || !form.otp}
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            Back to{' '}
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
              login
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

