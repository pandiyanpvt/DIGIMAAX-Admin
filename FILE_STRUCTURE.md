# DIGIMAAX Admin Panel - File Structure

## Project Structure

```
DIGIMAAX-Admin/
├── src/
│   ├── api/                    # API related files
│   │   ├── auth.ts            # Authentication API calls
│   │   ├── client.ts          # Axios client configuration
│   │   ├── mockData.ts        # Mock authentication service
│   │   └── index.ts           # API exports
│   │
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   │   ├── AdminLayout.tsx    # Main layout wrapper
│   │   │   ├── AdminSidebar.tsx   # Sidebar navigation
│   │   │   ├── AdminHeaderBar.tsx # Header bar
│   │   │   └── index.ts           # Component exports
│   │   └── common/             # Shared/common components
│   │       ├── PageContainer.tsx  # Page wrapper component
│   │       └── index.ts           # Component exports
│   │
│   ├── constants/             # Constants and configurations
│   │   ├── roles.ts           # Role definitions and permissions
│   │   ├── servicesQuickActions.tsx
│   │   └── index.ts           # Constants exports
│   │
│   ├── pages/                 # Page components
│   │   ├── admin/            # Admin panel pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AdminsManagement.tsx    # Superadmin only
│   │   │   ├── UsersManagement.tsx    # Admin & Superadmin
│   │   │   ├── BookingsManagement.tsx
│   │   │   ├── CustomersManagement.tsx
│   │   │   ├── ServicesManagement.tsx
│   │   │   ├── PromotionsManagement.tsx
│   │   │   ├── GalleryManagement.tsx
│   │   │   ├── ReportsAnalytics.tsx
│   │   │   ├── AuditLogs.tsx          # Superadmin only
│   │   │   ├── SystemSettings.tsx     # Superadmin only
│   │   │   ├── AdminProfile.tsx
│   │   │   └── index.ts               # Page exports
│   │   │
│   │   ├── user/              # Shop Worker panel pages
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── index.ts               # Page exports
│   │   │
│   │   ├── auth/              # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── Logout.tsx
│   │   │
│   │   └── index.ts           # All pages exports
│   │
│   ├── utils/                 # Utility functions
│   │   ├── mockData.ts        # Mock data for development
│   │   └── index.ts           # Utils exports
│   │
│   ├── styles/                # Global styles
│   │   ├── index.css          # Global CSS
│   │   └── theme.ts           # MUI theme configuration
│   │
│   ├── hooks/                 # Custom React hooks (empty - for future use)
│   ├── types/                 # TypeScript type definitions (empty - for future use)
│   ├── assets/                # Static assets (empty - for future use)
│   │
│   ├── App.tsx                # Main App component
│   └── main.tsx               # Application entry point
│
├── public/                    # Public static files
├── node_modules/              # Dependencies
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── index.html                 # HTML entry point
├── README.md                   # Project documentation
├── SETUP.md                    # Setup instructions
└── FILE_STRUCTURE.md           # This file
```

## Role-Based Access

### Superadmin (Developer)
- **Pages**: Dashboard, Admins Management, Shop Workers Management, Bookings, Services, Reports, Audit Logs, System Settings, Profile
- **Permissions**: Full system access, can manage admins and shop workers

### Admin
- **Pages**: Dashboard, Shop Workers Management, Bookings, Customers, Services, Promotions, Gallery, Reports, Profile
- **Permissions**: Can manage shop workers and bookings, cannot manage admins or access system settings

### Shop Worker (User)
- **Pages**: Dashboard, My Bookings, Profile
- **Permissions**: View own bookings and manage profile only

## Key Files

### Role Configuration
- `src/constants/roles.ts` - Defines roles, permissions, and navigation

### Mock Data
- `src/utils/mockData.ts` - Mock data for admins, shop workers, bookings, and audit logs
- `src/api/mockData.ts` - Mock authentication service

### Layout
- `src/components/admin/AdminLayout.tsx` - Main layout with role-based routing
- `src/components/admin/AdminSidebar.tsx` - Role-based navigation menu

## Removed Files
- `SettingsManagement.tsx` - Replaced by `SystemSettings.tsx`
- `FeedbackManagement.tsx` - Not used in current implementation
- `TestimonialsManagement.tsx` - Not used in current implementation

## Notes
- All exports are centralized through `index.ts` files for cleaner imports
- Empty directories (`hooks`, `types`, `assets`) are kept for future use
- Mock data is used when backend is unavailable

