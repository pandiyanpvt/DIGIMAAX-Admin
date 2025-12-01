import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'

interface AdminHeaderBarProps {
  pageTitle?: string
  onMenuChange?: (menuId: string) => void
  canAccessSettings?: boolean
  onMenuToggle?: () => void
}

function AdminHeaderBar({ pageTitle, onMenuChange, canAccessSettings = true, onMenuToggle }: AdminHeaderBarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      sx={{
        height: { xs: 64, md: 80 },
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3, md: 4 },
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Mobile Menu Toggle */}
      {isMobile && onMenuToggle && (
        <IconButton
          onClick={onMenuToggle}
          sx={{
            color: '#000000',
            mr: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
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
            color: '#28045C',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            letterSpacing: '-0.02em',
          }}
        >
          {pageTitle || 'Dashboard'}
        </Typography>
      </motion.div>

      {/* Right Section */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {/* User Profile */}
        {canAccessSettings && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => onMenuChange?.('profile')}
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
              <PersonIcon />
            </IconButton>
          </motion.div>
        )}

      </Box>
    </Box>
  )
}

export default AdminHeaderBar

