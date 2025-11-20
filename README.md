# DIGIMAAX Admin Panel

## Setup & Configuration

### API Configuration

The application requires a backend API server to function. Configure the API URL using environment variables:

1. **Create a `.env` file** in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

2. **Update the URL** to match your backend server address (if different from `http://localhost:3000`)

3. **Start your backend server** on the configured port before running the admin panel

4. **Run the application**:
   ```bash
   npm run dev
   ```

> **Note:** The application now includes **mock data** support. If the backend server is not running or unavailable, the app will automatically use mock data for authentication and other features. You'll see a warning in the console when mock data is being used.

### Mock Data Mode

When the backend is unavailable, the application automatically switches to mock data mode:
- **Login**: Works with any email/password combination
- **Register**: Creates a mock user account
- **Forgot Password**: Simulates sending a password reset email
- **Reset Password**: Simulates password reset

This allows you to develop and test the frontend without needing a running backend server.

---

## Page List and Responsibilities

## Dashboard
- KPIs (orders, revenue, customers, top services)
- Bookings trend, revenue chart, quick actions
- Alerts (low inventory, pending approvals)

## Bookings Management
- List, filter (status/date/search), CSV export
- View/edit booking, status transitions (pending → confirmed → completed/cancelled)
- Email/SMS actions (confirm, reminder, cancel)

## Customers Management
- List, search, import/export
- Customer profile: contact info, bookings history, vehicles, notes
- Edit/delete customer

## Services Management
- List services with categories
- Create/edit service (name, description, base price, duration, vehicle types, add-ons)
- Toggle active/inactive, reordering

## Promotions/Offers Management
- Create/edit promotions (title, description, date range)
- Discount types (percent/fixed), voucher codes, usage limits
- Activate/deactivate, usage analytics

## Gallery/Media Management
- Upload images/videos, categorize, captions, order
- Edit metadata, delete, bulk operations
- Mark as featured for landing sections

## Testimonials/Reviews
- Approve/reject, edit text, rating
- Highlight featured testimonials
- Spam/report handling

## Feedback/Contact Messages
- Inbox view (read/unread), search/filter
- View details, reply (email template), mark read/unread
- Export conversations

## Reports & Analytics
- Bookings by service, revenue by period
- Popular services, repeat customers rates
- Export PDF/CSV

## Users & Roles (Staff/Admin)
- List users, create/edit user, reset password
- Role assignment (Admin/Manager/Staff)
- Access control per module

## Settings / Configuration
- Business info, booking duration, working hours per day
- Email/SMS configuration (SMTP, templates toggles)
- Vehicle types, categories, site metadata

## Orders & Payments (if e-commerce)
- Order list, statuses, payment status
- Refunds, invoices, export

## Inventory (if applicable)
- Items, stock levels, suppliers
- Low-stock alerts, reorders

## CMS (optional)
- Manage pages/sections, banners, header images
- SEO metadata (title/description/OG)

## Notifications Center
- Email/SMS templates, triggers (booking events)
- Delivery logs

## Audit Logs
- Track admin actions (who did what & when)

## System/Integrations
- API keys, webhooks, third-party services
- Backups/export, environment flags

---

## Navigation Structure (Left Sidebar)
- Dashboard
- Bookings
- Customers
- Services
- Promotions
- Gallery
- Testimonials
- Feedback
- Reports
- Users
- Settings

Optional (toggle on demand): Orders, Inventory, CMS, Notifications, Audit Logs, Integrations.

---

## Data Model Highlights
- Booking: `id`, `customerId`, `serviceId`, `date/time`, `status`, `paymentStatus`, `amount`, `notes`
- Service: `id`, `name`, `category`, `basePrice`, `duration`, `vehicleTypes[]`, `addOns[]`
- Promotion: `id`, `title`, `type`, `value`, `dates`, `voucherCode`, `status`, `usageCount`
- Customer: `id`, `name`, `email`, `phone`, `vehicles[]`, `bookingsCount`, `lastBookingDate`
- Testimonial: `id`, `customerName`, `rating`, `text`, `date`, `status`
- Media: `id`, `url`, `type`, `caption`, `category`, `order`
- User: `id`, `name`, `email`, `role`, `lastLogin`, `status`

If you want, I can map each page to backend endpoints and define exact payloads next.

