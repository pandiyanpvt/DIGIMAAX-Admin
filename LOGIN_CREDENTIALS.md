# Digimaax Admin Panel - Login Credentials

## Test Login Credentials

The application uses mock authentication for development. **Any password will work** with these email addresses. The email address determines the user role.

### Superadmin (Full Access - Admin View + Dev View)
- **Email:** `superadmin@digimaax.com`
- **Password:** Any password (e.g., `password`, `admin123`, `test`)
- **Access:** 
  - ✅ All Admin View pages (Home, Contact Messages, Header Images, Gallery, Social Media, Product Categories, Products, Orders, Payments)
  - ✅ All Dev View pages (Users, User Roles, Cart Details)
  - ✅ Profile & Logout

### Admin (Admin View Only)
- **Email:** `admin@digimaax.com`
- **Password:** Any password (e.g., `password`, `admin123`, `test`)
- **Access:**
  - ✅ Admin View pages (Home, Contact Messages, Header Images, Gallery, Social Media, Product Categories, Products, Orders, Payments)
  - ❌ No Dev View access
  - ❌ No Legacy pages access

## Quick Login Tips

1. Navigate to the login page
2. Enter one of the email addresses above
3. Enter any password (it's not validated in mock mode)
4. Click "Sign In"

## Role-Based Navigation

The sidebar will automatically show only the menu items that the logged-in user has permission to access based on their role.

## Notes

- In production, these credentials would be validated against a real backend
- The mock authentication service accepts any password for development purposes
- User roles are determined by the email address pattern

