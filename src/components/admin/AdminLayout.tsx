import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { AdminSidebar, AdminHeaderBar } from './index'
import {
  AdminDashboard,
  AdminsManagement,
  UsersManagement,
  BookingsManagement,
  CustomersManagement,
  ServicesManagement,
  PromotionsManagement,
  GalleryManagement,
  ReportsAnalytics,
  AuditLogs,
  SystemSettings,
  AdminProfile,
} from '../../pages/admin'
import { UserDashboard, MyBookings, UserProfile } from '../../pages/user'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserRole, rolePermissions } from '../../constants/roles'

function AdminLayout() {
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const userRole = getCurrentUserRole()
  const permissions = rolePermissions[userRole]

  // Page title mapping
  const getPageTitle = (menuId: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      admins: 'Admins Management',
      users: 'Shop Workers Management',
      bookings: 'Bookings Management',
      'my-bookings': 'My Bookings',
      customers: 'Customers Management',
      services: 'Services Management',
      promotions: 'Promotions / Offers Management',
      gallery: 'Gallery / Media Management',
      reports: 'Reports / Analytics',
      'audit-logs': 'Audit Logs',
      settings: 'System Settings',
      profile: 'Profile',
    }
    return titles[menuId] || 'Dashboard'
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        if (userRole === 'user') {
          return <UserDashboard />
        }
        return <AdminDashboard />
      case 'admins':
        return <AdminsManagement />
      case 'users':
        return <UsersManagement />
      case 'bookings':
        return <BookingsManagement />
      case 'my-bookings':
        return <MyBookings />
      case 'customers':
        return <CustomersManagement />
      case 'services':
        return <ServicesManagement />
      case 'promotions':
        return <PromotionsManagement />
      case 'gallery':
        return <GalleryManagement />
      case 'reports':
        return <ReportsAnalytics />
      case 'audit-logs':
        return <AuditLogs />
      case 'settings':
        return <SystemSettings />
      case 'profile':
        if (userRole === 'user') {
          return <UserProfile />
        }
        return <AdminProfile />
      case 'logout':
        navigate('/logout', { replace: true })
        return null
      default:
        if (userRole === 'user') {
          return <UserDashboard />
        }
        return <AdminDashboard />
    }
  }

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      setSelectedMenu(customEvent.detail)
    }
    window.addEventListener('admin:navigate', handler as EventListener)
    return () => {
      window.removeEventListener('admin:navigate', handler as EventListener)
    }
  }, [])

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
        onMenuChange={setSelectedMenu}
        visibleMenuIds={permissions.navigation}
      />
      <Box
        sx={{
          flex: 1,
          marginLeft: '120px',
          width: 'calc(100% - 120px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AdminHeaderBar 
          pageTitle={getPageTitle(selectedMenu)} 
          onMenuChange={setSelectedMenu}
          canAccessSettings={permissions.canAccessSettings}
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

