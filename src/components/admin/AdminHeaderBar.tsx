import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

interface AdminHeaderBarProps {
  pageTitle?: string
  onMenuChange?: (menuId: string) => void
  canAccessSettings?: boolean
}

function AdminHeaderBar({ pageTitle, onMenuChange, canAccessSettings = true }: AdminHeaderBarProps) {
  return (
    <Box
      sx={{
        height: 80,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #7dd3fc 0%, #a5b4fc 50%, #f9a8d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          {pageTitle || 'Dashboard'}
        </Typography>
      </motion.div>

      {/* Right Section */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {/* Search Bar */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TextField
            placeholder="Search..."
            size="small"
            sx={{
              width: 320,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              borderRadius: 3,
              color: '#e2e8f0',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { 
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                },
                '&:hover fieldset': { 
                  border: '1px solid rgba(129, 140, 248, 0.8)',
                },
                '&.Mui-focused fieldset': { 
                  border: '2px solid #7dd3fc',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
                },
              },
              '& .MuiInputBase-input': {
                color: '#e2e8f0',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7dd3fc', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        {/* Settings */}
        {canAccessSettings && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => onMenuChange?.('settings')}
              sx={{
                color: '#34d399',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                '&:hover': { 
                  backgroundColor: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </motion.div>
        )}

        {/* User Profile */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => onMenuChange?.('profile')}
            sx={{
              p: 0.5,
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                cursor: 'pointer',
                border: '2px solid rgba(79, 70, 229, 0.6)',
                boxShadow: '0 6px 18px rgba(14, 165, 233, 0.35)',
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  )
}

export default AdminHeaderBar

