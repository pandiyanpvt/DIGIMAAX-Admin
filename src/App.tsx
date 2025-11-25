import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AdminLayout } from './components/admin'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout'
import { getCurrentUserRole } from './constants/roles'

const isAuthenticated = () => {
  try {
    const stored = localStorage.getItem('adminAuth')
    if (!stored) return false
    const { token } = JSON.parse(stored)
    return Boolean(token)
  } catch {
    return false
  }
}

// Get dashboard route based on user role
const getDashboardRoute = (): string => {
  if (!isAuthenticated()) return '/login'
  
  const role = getCurrentUserRole()
  if (role === 'superadmin') {
    return '/developer-dashboard'
  }
  if (role === 'admin') {
    return '/admin-dashboard'
  }

  // User role (userRoleId = 2) - not allowed in admin panel, redirect to login
  return '/login'
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const role = getCurrentUserRole()
  // Only admin and developer (superadmin) can access this panel
  if (role === 'user') {
    // Clear auth and redirect to login - user role not allowed
    localStorage.removeItem('adminAuth')
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Auth Routes - Only Login and Logout for Admin/Developer Panel */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Root path - always show login first, then redirect if authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to={getDashboardRoute()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Protected Routes - Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        {/* Protected Routes - Super Admin Dashboard */}
        <Route
          path="/developer-dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        {/* Protected Routes - Dashboard (fallback) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Pages */}
        <Route
          path="/contact-messages"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/header-images"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-media"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-categories"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Dev/Admin Management Pages */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-roles"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart-details"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Booking & Customer Management */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Services & Promotions */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promotions"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Reports & System */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Default redirect for authenticated users */}
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <Navigate to={getDashboardRoute()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

