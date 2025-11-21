export type UserRole = 'superadmin' | 'admin' | 'user'

export const roleLabels: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  user: 'Shop Worker',
}

type RolePermissionConfig = {
  navigation: string[]
  assignableRoles: UserRole[]
  canManageAdmins: boolean
  canManageUsers: boolean
  canManageBookings: boolean
  canManageServices: boolean
  canAccessSettings: boolean
  canViewReports: boolean
  canViewAuditLogs: boolean
}

export const rolePermissions: Record<UserRole, RolePermissionConfig> = {
  superadmin: {
    // Dev View + Admin View
    navigation: [
      'dashboard',
      // Admin View
      'contact-messages',
      'header-images',
      'gallery',
      'social-media',
      'product-categories',
      'products',
      'orders',
      'payments',
      // Dev View
      'users',
      'user-roles',
      'cart-details',
      // Essential
      'profile',
      'logout',
    ],
    assignableRoles: ['admin', 'user'],
    canManageAdmins: true,
    canManageUsers: true,
    canManageBookings: true,
    canManageServices: true,
    canAccessSettings: true,
    canViewReports: true,
    canViewAuditLogs: true,
  },
  admin: {
    // Admin View only
    navigation: [
      'dashboard',
      'contact-messages',
      'header-images',
      'gallery',
      'social-media',
      'product-categories',
      'products',
      'orders',
      'payments',
      'profile',
      'logout',
    ],
    assignableRoles: [],
    canManageAdmins: false,
    canManageUsers: false,
    canManageBookings: false,
    canManageServices: false,
    canAccessSettings: false,
    canViewReports: false,
    canViewAuditLogs: false,
  },
  user: {
    // No access as per requirements
    navigation: [],
    assignableRoles: [],
    canManageAdmins: false,
    canManageUsers: false,
    canManageBookings: false,
    canManageServices: false,
    canAccessSettings: false,
    canViewReports: false,
    canViewAuditLogs: false,
  },
}

export const resolveUserRole = (role?: string | null): UserRole => {
  // Support legacy role names for backward compatibility
  if (role === 'developer' || role === 'superadmin') {
    return 'superadmin'
  }
  if (role === 'booking' || role === 'user') {
    return 'user'
  }
  if (role === 'admin') {
    return 'admin'
  }
  return 'user' // Default to user for safety
}

// Helper function to get current user role from localStorage
export const getCurrentUserRole = (): UserRole => {
  try {
    const stored = localStorage.getItem('adminAuth')
    if (stored) {
      const { user } = JSON.parse(stored)
      return resolveUserRole(user?.role || user?.roleName)
    }
  } catch {}
  return 'user'
}

// Helper function to check if user has permission
export const hasPermission = (permission: keyof Omit<RolePermissionConfig, 'navigation' | 'assignableRoles'>): boolean => {
  const role = getCurrentUserRole()
  return rolePermissions[role][permission]
}


