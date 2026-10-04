# Noire Space -- Information Architecture

## 1. Public Website Sitemap

```
/                          Homepage
/programs                  Education programs listing
/programs/:slug            Program detail
/studio                    Studio services listing
/studio/:slug              Studio service detail
/services                  Creative services listing
/services/:slug            Service detail
/school                    School programs info + inquiry form
/booking                   Booking flow (after add to cart)
/checkout                  Checkout page
/about                     About Noire Space
/contact                   Contact page
/faq                       FAQ
/terms                     Terms & conditions
/privacy                   Privacy policy
```

## 2. Customer Area Sitemap

```
/account                   Dashboard
/account/profile           Profile settings
/account/bookings          Booking list
/account/bookings/:id      Booking detail
/account/orders            Order list
/account/orders/:id        Order detail
/account/settings          Account settings
```

## 3. Admin Area Sitemap

```
/admin                     Dashboard
/admin/products            Product management
/admin/categories          Category management
/admin/rooms               Room management
/admin/resources           Resource management
/admin/instructors         Instructor management
/admin/schedules           Schedule management
/admin/bookings            Booking management
/admin/orders              Order management
/admin/payments            Payment management
/admin/customers           Customer management
/admin/inquiries           School inquiry management
/admin/reports             Reports
/admin/settings            System settings
/admin/audit-log           Audit log viewer
```

---

## 4. Navigation Structure

### 4.1 Public Header

```
[Logo: Noire Space]

Primary Nav:
  Programs        -> /programs
  Studio          -> /studio
  Services        -> /services
  School          -> /school
  About           -> /about

Utility Nav (right):
  [Cart Icon + count]   -> /booking
  [Login / Account]     -> /account or /login
```

### 4.2 Public Footer

```
Column 1: Noire Space
  About           -> /about
  Contact         -> /contact
  FAQ             -> /faq

Column 2: Services
  Programs        -> /programs
  Studio          -> /studio
  Creative Services -> /services
  School          -> /school

Column 3: Legal
  Terms & Conditions -> /terms
  Privacy Policy     -> /privacy

Column 4: Social
  Instagram
  TikTok
  YouTube

Bottom: (c) Noire Space. All rights reserved.
```

### 4.3 Customer Account Sidebar

```
Dashboard         -> /account
My Bookings       -> /account/bookings
My Orders         -> /account/orders
Profile           -> /account/profile
Settings          -> /account/settings
Logout
```

### 4.4 Admin Sidebar

```
Dashboard         -> /admin

CATALOG
  Products        -> /admin/products
  Categories      -> /admin/categories

RESOURCES
  Rooms           -> /admin/rooms
  Resources       -> /admin/resources
  Instructors     -> /admin/instructors

OPERATIONS
  Schedules       -> /admin/schedules
  Bookings        -> /admin/bookings

COMMERCE
  Orders          -> /admin/orders
  Payments        -> /admin/payments

CUSTOMERS
  Customers       -> /admin/customers
  School Inquiries -> /admin/inquiries

SYSTEM
  Reports         -> /admin/reports
  Settings        -> /admin/settings
  Audit Log       -> /admin/audit-log
```

---

## 5. Page Content Hierarchy & Key Components

### 5.1 Public Pages

#### `/` Homepage

```
Content Hierarchy:
  1. Hero section (tagline, CTA)
  2. Service categories overview (Programs, Studio, Services)
  3. Featured products (curated by admin)
  4. Social proof / testimonials
  5. CTA section

Key Components:
  - HeroBanner
  - ServiceCategoryCards (3 cards linking to /programs, /studio, /services)
  - FeaturedProductGrid
  - TestimonialCarousel
  - CTABanner
```

#### `/programs` Education Programs Listing

```
Content Hierarchy:
  1. Page title + intro text
  2. Category filter (Junior Creator, Young Creator, Creator Pro, etc.)
  3. Product cards grid
  4. CTA for school programs

Key Components:
  - PageHeader
  - CategoryFilter
  - ProductCard (image, title, duration, price, CTA)
  - SchoolCTABanner
```

#### `/programs/:slug` Program Detail

```
Content Hierarchy:
  1. Breadcrumb
  2. Product hero (image gallery, title, price, duration)
  3. Description + what's included
  4. Schedule / availability calendar
  5. Requirements / prerequisites
  6. Instructor info
  7. Add to cart CTA
  8. Related programs

Key Components:
  - Breadcrumb
  - ProductImageGallery
  - ProductInfo (title, price, duration, capacity)
  - AvailabilityCalendar
  - TimeSlotPicker
  - InstructorCard
  - AddToCartButton
  - RelatedProducts
```

#### `/studio` Studio Services Listing

```
Content Hierarchy:
  1. Page title + studio description
  2. Studio packages grid
  3. Business content packages
  4. Gallery / portfolio

Key Components:
  - PageHeader
  - ProductCard
  - PortfolioGallery
```

#### `/studio/:slug` Studio Service Detail

```
Content Hierarchy:
  1. Breadcrumb
  2. Product hero (studio photos, title, price, duration)
  3. Description + what's included
  4. Availability calendar
  5. Add to cart CTA

Key Components:
  - Breadcrumb
  - ProductImageGallery
  - ProductInfo
  - AvailabilityCalendar
  - TimeSlotPicker
  - AddToCartButton
```

#### `/services` Creative Services Listing

```
Content Hierarchy:
  1. Page title + intro
  2. Service categories (Photography, Content, AI Editing)
  3. Service cards grid
  4. Portfolio showcase

Key Components:
  - PageHeader
  - CategoryFilter
  - ProductCard
  - PortfolioGallery
```

#### `/services/:slug` Service Detail

```
Content Hierarchy:
  1. Breadcrumb
  2. Service hero (portfolio images, title, price)
  3. Description + deliverables
  4. Process / how it works
  5. Availability calendar or contact CTA
  6. Add to cart CTA

Key Components:
  - Breadcrumb
  - ProductImageGallery
  - ProductInfo
  - ProcessSteps
  - AvailabilityCalendar
  - AddToCartButton
```

#### `/school` School Programs

```
Content Hierarchy:
  1. Page title + intro for schools
  2. Available school programs overview
  3. How it works (process steps)
  4. Inquiry form
  5. FAQ for schools

Key Components:
  - PageHeader
  - SchoolProgramCards
  - ProcessSteps
  - SchoolInquiryForm (school_name, pic_name, email, phone, student_count, program_interest, preferred_dates, notes)
  - FAQAccordion
```

#### `/booking` Booking Flow

```
Content Hierarchy:
  1. Cart summary (items, dates, times, prices)
  2. Customer info (pre-filled if logged in)
  3. Booking summary
  4. Proceed to checkout CTA

Key Components:
  - CartItemList (editable: change slot, remove)
  - CartSummary (subtotal, tax, total)
  - LoginPrompt (if not authenticated)
  - ProceedToCheckoutButton
```

#### `/checkout` Checkout

```
Content Hierarchy:
  1. Order summary (read-only)
  2. Customer details confirmation
  3. Payment method selection
  4. Terms acceptance
  5. Pay button

Key Components:
  - OrderSummary
  - CustomerInfoReview
  - PaymentMethodSelector
  - TermsCheckbox
  - PayButton
  - CountdownTimer (15 min hold)
```

#### `/about` About

```
Content Hierarchy:
  1. Brand story
  2. Mission / vision
  3. Team / instructors
  4. Location info + map

Key Components:
  - PageHeader
  - ContentSection
  - TeamGrid
  - LocationMap
```

#### `/contact` Contact

```
Content Hierarchy:
  1. Contact info (address, phone, email, hours)
  2. Contact form
  3. Map

Key Components:
  - ContactInfo
  - ContactForm (name, email, subject, message)
  - LocationMap
```

#### `/faq` FAQ

```
Content Hierarchy:
  1. Page title
  2. FAQ categories
  3. Question/answer accordion

Key Components:
  - PageHeader
  - FAQCategoryNav
  - FAQAccordion
```

#### `/terms`, `/privacy` Legal Pages

```
Content Hierarchy:
  1. Page title
  2. Last updated date
  3. Legal content sections

Key Components:
  - PageHeader
  - LegalContent (rendered markdown/rich text)
```

### 5.2 Customer Account Pages

#### `/account` Dashboard

```
Content Hierarchy:
  1. Welcome message
  2. Upcoming bookings (next 3)
  3. Recent orders
  4. Quick actions

Key Components:
  - WelcomeHeader
  - UpcomingBookingCards
  - RecentOrderList
  - QuickActionLinks
```

#### `/account/bookings` Booking List

```
Content Hierarchy:
  1. Page title
  2. Status filter tabs (upcoming, completed, cancelled)
  3. Booking list

Key Components:
  - StatusTabs
  - BookingListItem (product, date, time, status, actions)
  - EmptyState
```

#### `/account/bookings/:id` Booking Detail

```
Content Hierarchy:
  1. Booking status badge
  2. Product info (name, date, time, location, instructor)
  3. Payment status
  4. Actions (reschedule request, cancel if eligible)
  5. Status history timeline

Key Components:
  - StatusBadge
  - BookingDetailCard
  - PaymentStatusCard
  - ActionButtons (reschedule, cancel)
  - StatusTimeline
```

#### `/account/orders` Order List

```
Content Hierarchy:
  1. Page title
  2. Order list (order number, date, total, status)

Key Components:
  - OrderListItem
  - StatusBadge
  - EmptyState
```

#### `/account/orders/:id` Order Detail

```
Content Hierarchy:
  1. Order number + status
  2. Order items list
  3. Price breakdown
  4. Payment info
  5. Receipt download

Key Components:
  - OrderHeader
  - OrderItemList
  - PriceBreakdown
  - PaymentInfo
  - ReceiptDownloadButton
```

#### `/account/profile` Profile Settings

```
Key Components:
  - ProfileForm (name, email, phone)
  - PasswordChangeForm
```

#### `/account/settings` Account Settings

```
Key Components:
  - NotificationPreferences
  - DeleteAccountSection
```

### 5.3 Admin Pages

#### `/admin` Dashboard

```
Content Hierarchy:
  1. Today's stats (bookings, revenue, new orders)
  2. Upcoming bookings today
  3. Pending actions (unconfirmed bookings, unverified payments)
  4. Alerts (conflicts, expirations)
  5. Quick stats chart (7-day revenue, booking count)

Key Components:
  - StatCards
  - TodayBookingList
  - PendingActionList
  - AlertList
  - MiniChart
```

#### `/admin/products` Product Management

```
Content Hierarchy:
  1. Page title + "Add Product" button
  2. Filters (type, category, status)
  3. Product data table
  4. Product create/edit form (modal or separate page)

Key Components:
  - DataTable (sortable, searchable, paginated)
  - FilterBar
  - ProductForm (name, slug, type, category, description, price, duration, capacity, images, status, required_resources)
  - StatusBadge
  - ActionMenu (edit, duplicate, archive)
```

#### `/admin/categories` Category Management

```
Key Components:
  - DataTable
  - CategoryForm (name, slug, description, parent, sort_order, status)
```

#### `/admin/rooms` Room Management

```
Key Components:
  - DataTable
  - RoomForm (name, capacity, status, amenities)
```

#### `/admin/resources` Resource Management

```
Key Components:
  - DataTable
  - ResourceForm (name, type, status, description)
```

#### `/admin/instructors` Instructor Management

```
Key Components:
  - DataTable
  - InstructorForm (name, bio, photo, specializations, status)
```

#### `/admin/schedules` Schedule Management

```
Content Hierarchy:
  1. Calendar view (week/month)
  2. Schedule list view (toggle)
  3. Create schedule form
  4. Blocked dates management

Key Components:
  - ScheduleCalendar
  - ScheduleForm (product, days_of_week, start_time, end_time, valid_from, valid_until)
  - BlockedDateForm (date, reason)
  - ResourceConflictWarning
```

#### `/admin/bookings` Booking Management

```
Content Hierarchy:
  1. Status tabs (pending, confirmed, today, completed)
  2. Booking data table
  3. Booking detail (drawer or modal)

Key Components:
  - StatusTabs
  - DataTable
  - BookingDetailDrawer
  - StatusUpdateActions (confirm, cancel, mark completed, mark no_show)
  - RescheduleForm
```

#### `/admin/orders` Order Management

```
Key Components:
  - DataTable (order_number, customer, total, status, date)
  - OrderDetailDrawer
  - StatusUpdateActions
```

#### `/admin/payments` Payment Management

```
Key Components:
  - DataTable (payment_id, order, amount, method, status, date)
  - PaymentDetailDrawer
  - ManualVerificationButton
  - PaymentLogTimeline
```

#### `/admin/customers` Customer Management

```
Key Components:
  - DataTable (name, email, phone, total_bookings, joined_date)
  - CustomerDetailDrawer (profile, booking history, order history)
```

#### `/admin/inquiries` School Inquiry Management

```
Key Components:
  - DataTable (school_name, pic, program, status, date)
  - InquiryDetailDrawer
  - StatusUpdateActions (new, contacted, proposal_sent, confirmed, declined)
  - InternalNotesForm
```

#### `/admin/reports` Reports

```
Key Components:
  - DateRangePicker
  - RevenueReport (chart + table)
  - BookingReport (by product, by status)
  - UtilizationReport (room/resource usage)
  - ExportButton (CSV)
```

#### `/admin/settings` System Settings

```
Key Components:
  - BusinessHoursForm
  - BookingPolicyForm (window, buffer, hold time, reschedule rules)
  - PaymentSettingsForm (gateway config, expiry)
  - SiteSettingsForm (site name, contact info, social links)
```

#### `/admin/audit-log` Audit Log Viewer

```
Key Components:
  - DataTable (timestamp, actor, action, entity_type, entity_id)
  - FilterBar (date range, actor, action type)
  - AuditDetailModal (before/after diff)
```

---

## 6. URL Pattern Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `/:section` | Listing page | `/programs` |
| `/:section/:slug` | Detail page (public, SEO slug) | `/programs/creator-pro` |
| `/account/:section` | Customer area | `/account/bookings` |
| `/account/:section/:id` | Customer detail (UUID) | `/account/bookings/abc-123` |
| `/admin/:section` | Admin list/management | `/admin/products` |

---

## 7. Shared Layout Structure

### Public Layout

```
+------------------------------------------+
| Header (logo, nav, cart, auth)           |
+------------------------------------------+
| Main Content                             |
|                                          |
|                                          |
+------------------------------------------+
| Footer (links, social, legal)            |
+------------------------------------------+
```

### Customer Account Layout

```
+------------------------------------------+
| Header (logo, nav, cart, auth)           |
+--------+---------------------------------+
| Sidebar| Main Content                    |
| (nav)  |                                 |
|        |                                 |
+--------+---------------------------------+
```

### Admin Layout

```
+--------+---------------------------------+
| Sidebar| Top Bar (search, notifications, |
| (nav)  |          user menu)             |
|        +---------------------------------+
|        | Main Content                    |
|        |                                 |
|        |                                 |
+--------+---------------------------------+
```
