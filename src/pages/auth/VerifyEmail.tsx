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
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)',
          animation: 'pulse 20s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1) rotate(0deg)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'scale(1.1) rotate(180deg)',
              opacity: 0.8,
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
          background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            },
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
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.8)',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(102, 126, 234, 0.9)',
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
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.8)',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'rgba(102, 126, 234, 0.9)',
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
                transition: 'all 0.3s ease',
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
                color: 'rgba(118, 75, 162, 0.9)',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  color: 'rgba(118, 75, 162, 1)',
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

