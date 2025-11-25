export type UserRole = 'superadmin' | 'admin' | 'user'

const roleIdToRole: Record<number, UserRole> = {
  1: 'admin',
  2: 'user',
  3: 'superadmin',
}

const envSiteUrl =
  (import.meta as any)?.env?.VITE_DIGIMAAX_SITE_URL?.trim?.() ||
  (typeof window !== 'undefined' && (window as any).__DIGIMAAX_SITE_URL__) ||
  ''

export const DIGIMAAX_PUBLIC_SITE_URL = envSiteUrl || 'https://digimaax.com'

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
    // Dev View + Admin View (Developer login - access to all pages)
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
      'user-roles',
      'cart-details',
      'user-logs',
      // Essential
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

const normalizeRoleText = (role?: string | null) => role?.toString().trim().toLowerCase() || ''

export const resolveUserRole = (role?: string | null, roleId?: number | null): UserRole => {
  if (typeof roleId === 'number' && roleIdToRole[roleId]) {
    return roleIdToRole[roleId]
  }

  const normalizedRole = normalizeRoleText(role)

  // Handle developer roles (including typo "devoloper")
  if (normalizedRole === 'developer' || normalizedRole === 'devoloper' || normalizedRole === 'superadmin' || normalizedRole === 'super admin' || normalizedRole === 'super_admin') {
    return 'superadmin'
  }
  if (normalizedRole === 'booking' || normalizedRole === 'user') {
    return 'user'
  }
  if (normalizedRole === 'admin') {
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
      const rawRoleId = user?.userRoleId
      const parsedRoleId =
        rawRoleId === undefined || rawRoleId === null ? undefined : Number(rawRoleId)
      const resolvedRoleId =
        typeof parsedRoleId === 'number' && Number.isFinite(parsedRoleId) ? parsedRoleId : undefined
      return resolveUserRole(user?.role || user?.roleName, resolvedRoleId)
    }
  } catch {}
  return 'user'
}

// Helper function to check if user has permission
export const hasPermission = (permission: keyof Omit<RolePermissionConfig, 'navigation' | 'assignableRoles'>): boolean => {
  const role = getCurrentUserRole()
  return rolePermissions[role][permission]
}

// Helper function to get current user data from localStorage
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem('adminAuth')
    if (stored) {
      const { user } = JSON.parse(stored)
      return user || null
    }
  } catch {}
  return null
}

// Helper function to get user's username/email
export const getCurrentUsername = (): string | null => {
  const user = getCurrentUser()
  if (!user) return null
  
  // Check email first, then firstName, then name
  return user.email || user.firstName || user.name || null
}

export const redirectToPublicSite = () => {
  if (typeof window === 'undefined') return
  window.location.replace(DIGIMAAX_PUBLIC_SITE_URL)
}


