import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { AdminSidebar, AdminHeaderBar } from './index'
import {
  AdminDashboard,
  AdminsManagement,
  BookingsManagement,
  CustomersManagement,
  ServicesManagement,
  PromotionsManagement,
  GalleryManagement,
  ReportsAnalytics,
  AuditLogs,
  SystemSettings,
  ContactMessages,
  HeaderImages,
  SocialMediaLinks,
  ProductCategories,
  Products,
  Orders,
  Payments,
  UserRoleManagement,
  CartDetails,
  UserLogs,
} from '../../pages/admin'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUserRole, rolePermissions } from '../../constants/roles'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const userRole = getCurrentUserRole()
  const permissions = rolePermissions[userRole]

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  // Sync selectedMenu with URL path
  useEffect(() => {
    const path = location.pathname
    // Remove leading slash and use as menu ID
    // Handle dashboard routes (admin-dashboard, super-admin-dashboard, dashboard)
    const menuId = path === '/' || 
                   path === '/dashboard' || 
                   path === '/admin-dashboard' || 
                   path === '/super-admin-dashboard' 
                   ? 'dashboard' 
                   : path.slice(1)
    setSelectedMenu(menuId)
    
    // Handle logout navigation
    if (menuId === 'logout') {
      navigate('/logout', { replace: true })
    }
  }, [location.pathname, navigate])

  // Page title mapping
  const getPageTitle = (menuId: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'contact-messages': 'Contact Messages',
      'header-images': 'Header Images',
      gallery: 'Gallery',
      'social-media': 'Social Media Links',
      'product-categories': 'Product Categories',
      products: 'Products',
      orders: 'Orders',
      payments: 'Payments',
      'user-roles': 'User Role Management',
      'cart-details': 'Cart Details',
      'user-logs': 'User Login Logs',
      admins: 'Admins Management',
      bookings: 'Bookings Management',
      'my-bookings': 'My Bookings',
      customers: 'Customers Management',
      services: 'Services Management',
      promotions: 'Promotions Management',
      reports: 'Reports & Analytics',
      'audit-logs': 'Audit Logs',
      settings: 'System Settings',
    }
    return titles[menuId] || 'Dashboard'
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <AdminDashboard />
      // Admin View Pages
      case 'contact-messages':
        return <ContactMessages />
      case 'header-images':
        return <HeaderImages />
      case 'gallery':
        return <GalleryManagement />
      case 'social-media':
        return <SocialMediaLinks />
      case 'product-categories':
        return <ProductCategories />
      case 'products':
        return <Products />
      case 'orders':
        return <Orders />
      case 'payments':
        return <Payments />
      // Dev View Pages
      case 'user-roles':
        return <UserRoleManagement />
      case 'cart-details':
        return <CartDetails />
      case 'user-logs':
        return <UserLogs />
      // Legacy Pages
      case 'admins':
        return <AdminsManagement />
      case 'bookings':
        return <BookingsManagement />
      case 'my-bookings':
        return <BookingsManagement />
      case 'customers':
        return <CustomersManagement />
      case 'services':
        return <ServicesManagement />
      case 'promotions':
        return <PromotionsManagement />
      case 'reports':
        return <ReportsAnalytics />
      case 'audit-logs':
        return <AuditLogs />
      case 'settings':
        return <SystemSettings />
      case 'logout':
        // Don't navigate during render - handle in useEffect
        return null
      default:
        return <AdminDashboard />
    }
  }

  // Handle custom navigation events
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      const menuId = customEvent.detail
      setSelectedMenu(menuId)
      // Navigate to the corresponding route
      if (menuId === 'dashboard' || menuId === '/') {
        // Navigate to the appropriate dashboard based on role
        if (userRole === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/dashboard')
        }
      } else if (menuId !== 'logout') {
        navigate(`/${menuId}`)
      }
    }
    window.addEventListener('admin:navigate', handler as EventListener)
    return () => {
      window.removeEventListener('admin:navigate', handler as EventListener)
    }
  }, [navigate, userRole])

  // Update menu selection handler to navigate
  const handleMenuChange = (menuId: string) => {
    setSelectedMenu(menuId)
    if (menuId === 'dashboard' || menuId === '/') {
      // Navigate to the appropriate dashboard based on role
      if (userRole === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard')
      }
    } else if (menuId === 'logout') {
      navigate('/logout')
    } else {
      navigate(`/${menuId}`)
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #29085D 0%, #1A0540 50%, #0D0220 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(33, 150, 243, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 64, 129, 0.18) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <AdminSidebar 
        selectedMenu={selectedMenu} 
        onMenuChange={handleMenuChange}
        visibleMenuIds={permissions.navigation}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      {isMobile && sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: '260px' },
          width: { xs: '100%', md: 'calc(100% - 260px)' },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <AdminHeaderBar 
          pageTitle={getPageTitle(selectedMenu)} 
          onMenuChange={handleMenuChange}
          canAccessSettings={permissions.canAccessSettings}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout

