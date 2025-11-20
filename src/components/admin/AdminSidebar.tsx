import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import {
  Dashboard as DashboardIcon,
  BookOnline as BookingsIcon,
  BusinessCenter as ServicesIcon,
  LocalOffer as PromotionsIcon,
  PhotoLibrary as GalleryIcon,
  Analytics as ReportsIcon,
  Logout as LogoutIcon,
  PeopleAlt as UsersIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminsIcon,
  History as AuditLogsIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  shortLabel?: string
}

interface SidebarProps {
  selectedMenu: string
  onMenuChange: (menuId: string) => void
  visibleMenuIds?: string[]
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, shortLabel: 'Home' },
  { id: 'admins', label: 'Admins', icon: <AdminsIcon />, shortLabel: 'Admins' },
  { id: 'users', label: 'Shop Workers', icon: <UsersIcon />, shortLabel: 'Workers' },
  { id: 'bookings', label: 'Bookings', icon: <BookingsIcon />, shortLabel: 'Book' },
  { id: 'my-bookings', label: 'My Bookings', icon: <BookingsIcon />, shortLabel: 'My Book' },
  { id: 'customers', label: 'Customers', icon: <PersonIcon />, shortLabel: 'Customer' },
  { id: 'services', label: 'Services', icon: <ServicesIcon />, shortLabel: 'Service' },
  { id: 'promotions', label: 'Promotions', icon: <PromotionsIcon />, shortLabel: 'Offer' },
  { id: 'gallery', label: 'Gallery', icon: <GalleryIcon />, shortLabel: 'Media' },
  { id: 'reports', label: 'Reports', icon: <ReportsIcon />, shortLabel: 'Analytic' },
  { id: 'audit-logs', label: 'Audit Logs', icon: <AuditLogsIcon />, shortLabel: 'Logs' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, shortLabel: 'Setup' },
  { id: 'profile', label: 'Profile', icon: <PersonIcon />, shortLabel: 'Profile' },
  { id: 'logout', label: 'Logout', icon: <LogoutIcon />, shortLabel: 'Exit' },
]

function AdminSidebar({ selectedMenu, onMenuChange, visibleMenuIds }: SidebarProps) {
  const filteredMenuItems = visibleMenuIds
    ? menuItems.filter((item) => visibleMenuIds.includes(item.id))
    : menuItems

  return (
    <Box
      sx={{
        width: 120,
        height: '100vh',
        background: 'rgba(6, 11, 25, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(2, 6, 23, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4,
        pb: 4,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        borderTopRightRadius: 32,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
      }}
    >
      {/* Glow accents */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-20%',
            left: '10%',
            width: '120%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.35), transparent 60%)',
            filter: 'blur(12px)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '120%',
            height: '45%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 65%)',
            filter: 'blur(18px)',
          },
        }}
      />
      {/* Logo */}
      <Box
        sx={{
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src="/DIGIMAAX_LOGO-01 1.png"
          alt="DIGIMAAX"
          sx={{
            maxWidth: '80px',
            maxHeight: '80px',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Menu Items */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
          },
        }}
      >
        {filteredMenuItems.map((item, index) => {
          const isActive = selectedMenu === item.id
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Box
                onClick={() => onMenuChange(item.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  py: 1.3,
                  px: 2,
                  borderRadius: 5,
                  background:
                    isActive
                      ? 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(14,165,233,0.15))'
                      : 'rgba(255,255,255,0.02)',
                  border: isActive ? '1px solid rgba(125,211,252,0.5)' : '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 8px 24px rgba(14, 165, 233, 0.35)' : 'none',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    lineHeight: 1.2,
                  }}
                >
                  {item.shortLabel || item.label}
                </Typography>
              </Box>
            </motion.div>
          )
        })}
      </Box>
    </Box>
  )
}

export default AdminSidebar

