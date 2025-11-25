import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import {
  Dashboard as DashboardIcon,
  PhotoLibrary as GalleryIcon,
  Logout as LogoutIcon,
  Email as ContactIcon,
  Image as ImageIcon,
  Share as SocialIcon,
  Category as CategoryIcon,
  Inventory as ProductIcon,
  ShoppingCart as OrderIcon,
  Payment as PaymentIcon,
  AdminPanelSettings as RoleIcon,
  ShoppingBag as CartIcon,
  History as LogsIcon,
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
  open?: boolean
  onClose?: () => void
  isMobile?: boolean
}

const menuItems: MenuItem[] = [
  // Admin View
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, shortLabel: 'Home' },
  { id: 'contact-messages', label: 'Contact Messages', icon: <ContactIcon />, shortLabel: 'Contact' },
  { id: 'header-images', label: 'Header Images', icon: <ImageIcon />, shortLabel: 'Headers' },
  { id: 'gallery', label: 'Gallery', icon: <GalleryIcon />, shortLabel: 'Gallery' },
  { id: 'social-media', label: 'Social Media', icon: <SocialIcon />, shortLabel: 'Social' },
  { id: 'product-categories', label: 'Categories', icon: <CategoryIcon />, shortLabel: 'Categories' },
  { id: 'products', label: 'Products', icon: <ProductIcon />, shortLabel: 'Products' },
  { id: 'orders', label: 'Orders', icon: <OrderIcon />, shortLabel: 'Orders' },
  { id: 'payments', label: 'Payments', icon: <PaymentIcon />, shortLabel: 'Payments' },
  // Dev View
  { id: 'user-roles', label: 'User Roles', icon: <RoleIcon />, shortLabel: 'Roles' },
  { id: 'cart-details', label: 'Cart Details', icon: <CartIcon />, shortLabel: 'Carts' },
  { id: 'user-logs', label: 'User Logs', icon: <LogsIcon />, shortLabel: 'Logs' },
  // Essential
  { id: 'logout', label: 'Logout', icon: <LogoutIcon />, shortLabel: 'Exit' },
]

function AdminSidebar({ selectedMenu, onMenuChange, visibleMenuIds, open = true, onClose, isMobile = false }: SidebarProps) {
  const filteredMenuItems = visibleMenuIds
    ? menuItems.filter((item) => visibleMenuIds.includes(item.id))
    : menuItems

  const handleMenuClick = (menuId: string) => {
    onMenuChange(menuId)
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <Box
      sx={{
        width: { xs: 280, md: 260 },
        height: '100vh',
        background: 'rgba(6, 11, 25, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(2, 6, 23, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        pt: 4,
        pb: 4,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        borderTopRightRadius: { xs: 0, md: 32 },
        borderBottomRightRadius: { xs: 0, md: 40 },
        overflow: 'hidden',
        transform: { xs: open ? 'translateX(0)' : 'translateX(-100%)', md: 'translateX(0)' },
        transition: 'transform 0.3s ease-in-out',
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
          px: 2,
        }}
      >
        <Box
          component="img"
          src="/DIGIMAAX_LOGO-01 1.png"
          alt="DIGIMAAX"
          sx={{
            maxWidth: '100px',
            maxHeight: '100px',
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
          gap: 1,
          width: '100%',
          px: 2,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.5)',
            },
          },
        }}
      >
        {filteredMenuItems.map((item, index) => {
          const isActive = selectedMenu === item.id
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              <Box
                onClick={() => handleMenuClick(item.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                  py: 1.5,
                  px: 2.5,
                  borderRadius: 2,
                  background:
                    isActive
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.15))'
                      : 'rgba(255,255,255,0.02)',
                  border: isActive 
                    ? '1px solid rgba(102, 126, 234, 0.4)' 
                    : '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  boxShadow: isActive 
                    ? '0 4px 16px rgba(102, 126, 234, 0.3)' 
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: isActive ? '4px' : '0px',
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '0 4px 4px 0',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    transform: 'translateX(4px)',
                    '&::before': {
                      width: '4px',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    color: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 24,
                    transition: 'color 0.3s ease',
                    '& svg': {
                      fontSize: '1.5rem',
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: { xs: '0.875rem', md: '0.95rem' },
                    textAlign: 'left',
                    textTransform: 'none',
                    lineHeight: 1.4,
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {isMobile ? (item.shortLabel || item.label) : item.label}
                </Typography>
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '50%': {
                          opacity: 0.6,
                          transform: 'scale(0.8)',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </motion.div>
          )
        })}
      </Box>
    </Box>
  )
}

export default AdminSidebar

