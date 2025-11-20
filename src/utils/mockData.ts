// Comprehensive mock data for all panels

export interface MockAdmin {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'admin'
  phoneNumber?: string
  status: 'active' | 'inactive'
  lastLogin?: string
  createdAt: string
  createdBy?: string
}

export interface MockUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: 'user'
  status: 'active' | 'inactive'
  isVerified: boolean
  lastLogin?: string
  createdAt: string
  createdBy?: string
}

export interface MockBooking {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  serviceDetails: string
  status: 'pending' | 'quoted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  quoteAmount?: number
  bookingDate: string
  createdAt: string
  notes?: string
}

export interface MockAuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  timestamp: string
  ipAddress?: string
}

// Mock Admins Data
export const mockAdmins: MockAdmin[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@digimaax.com',
    role: 'superadmin',
    phoneNumber: '+94771234567',
    status: 'active',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Admin One',
    email: 'admin1@digimaax.com',
    role: 'admin',
    phoneNumber: '+94771234568',
    status: 'active',
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Admin Two',
    email: 'admin2@digimaax.com',
    role: 'admin',
    phoneNumber: '+94771234569',
    status: 'active',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '1',
  },
  {
    id: '4',
    name: 'Admin Three',
    email: 'admin3@digimaax.com',
    role: 'admin',
    phoneNumber: '+94771234570',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '1',
  },
]

// Mock Users Data
export const mockUsers: MockUser[] = [
  {
    id: '101',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+94771234571',
    role: 'user',
    status: 'active',
    isVerified: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '2',
  },
  {
    id: '102',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+94771234572',
    role: 'user',
    status: 'active',
    isVerified: true,
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '2',
  },
  {
    id: '103',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phoneNumber: '+94771234573',
    role: 'user',
    status: 'active',
    isVerified: false,
    lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '3',
  },
  {
    id: '104',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    phoneNumber: '+94771234574',
    role: 'user',
    status: 'inactive',
    isVerified: true,
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '2',
  },
]

// Mock Bookings Data
export const mockBookings: MockBooking[] = [
  {
    id: '201',
    userId: '101',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+94771234571',
    serviceType: 'CCTV Installation',
    serviceDetails: 'Install CCTV system for home security - 4 cameras, DVR system',
    status: 'confirmed',
    quoteAmount: 125000,
    bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Customer prefers evening installation',
  },
  {
    id: '202',
    userId: '102',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+94771234572',
    serviceType: 'LED Board Designing',
    serviceDetails: 'Design and install LED signboard for shop front - 3x2 feet',
    status: 'quoted',
    quoteAmount: 85000,
    bookingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Waiting for customer approval',
  },
  {
    id: '203',
    userId: '101',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+94771234571',
    serviceType: '3D Printed Model Creation',
    serviceDetails: 'Create 3D model of building architecture - scale 1:100',
    status: 'in-progress',
    quoteAmount: 45000,
    bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Model is 60% complete',
  },
  {
    id: '204',
    userId: '103',
    customerName: 'Bob Johnson',
    customerEmail: 'bob.johnson@example.com',
    customerPhone: '+94771234573',
    serviceType: 'Interior Designing',
    serviceDetails: 'Complete interior design for office space - 2000 sq ft',
    status: 'pending',
    bookingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Need to send quote',
  },
  {
    id: '205',
    userId: '102',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+94771234572',
    serviceType: 'POS System Setup',
    serviceDetails: 'Install POS system for retail store - 2 terminals',
    status: 'completed',
    quoteAmount: 95000,
    bookingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Installation completed successfully',
  },
]

// Mock Audit Logs Data
export const mockAuditLogs: MockAuditLog[] = [
  {
    id: '301',
    userId: '1',
    userName: 'Super Admin',
    action: 'CREATE',
    resource: 'Admin',
    details: 'Created new admin: Admin Three',
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
  },
  {
    id: '302',
    userId: '2',
    userName: 'Admin One',
    action: 'CREATE',
    resource: 'Shop Worker',
    details: 'Created new shop worker: John Doe',
    timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.101',
  },
  {
    id: '303',
    userId: '1',
    userName: 'Super Admin',
    action: 'UPDATE',
    resource: 'System Settings',
    details: 'Updated email configuration',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
  },
  {
    id: '304',
    userId: '2',
    userName: 'Admin One',
    action: 'UPDATE',
    resource: 'Booking',
    details: 'Updated booking #202 status to quoted',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.101',
  },
  {
    id: '305',
    userId: '3',
    userName: 'Admin Two',
    action: 'DELETE',
    resource: 'Shop Worker',
    details: 'Deleted shop worker: Old User',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.102',
  },
  {
    id: '306',
    userId: '1',
    userName: 'Super Admin',
    action: 'LOGIN',
    resource: 'Authentication',
    details: 'User logged in successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
  },
]

// Helper function to get current user ID
export const getCurrentUserId = (): string | null => {
  try {
    const stored = localStorage.getItem('adminAuth')
    if (stored) {
      const { user } = JSON.parse(stored)
      return user?.id || null
    }
  } catch {}
  return null
}

// Helper function to get user's own bookings
export const getUserBookings = (userId: string): MockBooking[] => {
  return mockBookings.filter((booking) => booking.userId === userId)
}

// Helper function to get admin by ID
export const getAdminById = (id: string): MockAdmin | undefined => {
  return mockAdmins.find((admin) => admin.id === id)
}

// Helper function to get user by ID
export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find((user) => user.id === id)
}

