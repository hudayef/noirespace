# Noire Space — User Flows (MVP)

This document details all user flows for the MVP. Each flow shows the sequence of steps, decision points, error states, and pages/screens involved.

---

## 1. Customer Discovery Flow

**Actor**: Public visitor (unauthenticated)

```
Landing Page
  |
  +--> Browse Categories (via navbar or hero CTA)
  |      |
  |      +--> Category Page (/programs, /studio, /services, /school)
  |             |
  |             +--> Product Card (list view)
  |                    |
  |                    +--> Product Detail Page (/programs/creator-pro)
  |                           |
  |                           +--> CTA: "Book Now" or "Inquire" (school)
  |
  +--> Search / Filter (within category page)
         |
         +--> Filter by: type, duration, price range
         |
         +--> Results update
                |
                +--> Product Card --> Product Detail Page
```

**Pages involved**:
- `/` — Landing / Homepage
- `/programs`, `/studio`, `/services`, `/school` — Category pages
- `/programs/:slug`, `/studio/:slug`, `/services/:slug` — Product detail pages

**Decision points**:
- Product type = school program? --> Show "Inquire" button (goes to School Inquiry Flow, section 7)
- Product type = retail (education, studio, creative)? --> Show "Book Now" button (goes to Booking Flow, section 2)
- Product status = archived/draft? --> 404 page

**Error states**:
- Category has no published products --> "No products available" message
- Invalid slug --> 404 page

---

## 2. Booking Flow

**Actor**: Customer (authenticated required at checkout)

```
Product Detail Page
  |
  +--> Click "Book Now"
  |
  +--> Check Availability (calendar view)
  |      |
  |      +--> Is product available on any date?
  |             |
  |             Yes --> Show available dates (highlighted on calendar)
  |             No  --> "No availability. Check back later." (dead end)
  |
  +--> Select Date
  |      |
  |      +--> Load available time slots for selected date
  |             |
  |             +--> Slots found?
  |                    |
  |                    Yes --> Show time slots
  |                    No  --> "No slots on this date. Select another." (back to calendar)
  |
  +--> Select Time Slot
  |      |
  |      +--> System validates: resource (room + instructor + equipment) available?
  |             |
  |             Yes --> Show booking summary (product, date, time, price)
  |             No  --> "Slot no longer available." --> Refresh slots
  |
  +--> Select Options (if any: participant count, add-ons)
  |
  +--> Click "Add to Cart"
  |      |
  |      +--> Is user logged in?
  |      |      |
  |      |      Yes --> Add item to cart, hold slot (15 min timer starts)
  |      |      No  --> Redirect to Login/Register --> return to cart after auth
  |      |
  |      +--> Availability re-validated at add-to-cart
  |             |
  |             Still available? Yes --> Item added
  |             No --> "Slot taken. Please select another." --> Back to time slots
  |
  +--> Cart Page (/cart)
  |      |
  |      +--> Review items (can add more items or remove)
  |      +--> Shows hold timer (15 min countdown)
  |      +--> Click "Checkout"
  |             |
  |             +--> Hold expired?
  |                    |
  |                    Yes --> "Your hold expired. Items removed." --> Re-select
  |                    No  --> Proceed to checkout
  |
  +--> Checkout Page (/checkout)
  |      |
  |      +--> Confirm customer details (name, email, phone)
  |      +--> Review order summary (items, subtotal, tax, total)
  |      +--> Availability re-validated at checkout
  |      |      |
  |      |      Still available? Yes --> Continue
  |      |      No --> "Slot no longer available." --> Remove item, back to cart
  |      |
  |      +--> Click "Place Order"
  |             |
  |             +--> Order created (status: awaiting_payment)
  |             +--> Booking created (status: pending)
  |             +--> Redirect to Payment
  |
  +--> Payment Page (/payment/:orderId)
  |      |
  |      +--> Payment gateway UI (Xendit)
  |      +--> Customer completes payment
  |             |
  |             +--> Payment success?
  |                    |
  |                    Yes --> Payment status: paid
  |                    |       Order status: paid
  |                    |       Booking status: confirmed
  |                    |       --> Redirect to Confirmation Page
  |                    |
  |                    No  --> Payment status: failed
  |                    |       --> "Payment failed. Try again." --> Retry or cancel
  |                    |
  |                    Expired (24h) --> Payment status: expired
  |                                     Order status: cancelled
  |                                     Booking status: cancelled
  |                                     Slot released
  |
  +--> Confirmation Page (/booking/:bookingId/confirmation)
         |
         +--> Show booking details (product, date, time, location, order number)
         +--> Email confirmation sent
         +--> CTA: "View My Bookings" --> Customer Dashboard
```

**Pages involved**:
- `/programs/:slug` (or `/studio/:slug`, `/services/:slug`) — Product detail + availability
- `/cart` — Cart
- `/checkout` — Checkout
- `/payment/:orderId` — Payment
- `/booking/:bookingId/confirmation` — Confirmation

**Business rules applied**:
- Booking window: 1 day to 30 days ahead (BIZ-02)
- Buffer time between bookings: 15 min (BIZ-03)
- Checkout hold: 15 min (BIZ-07)
- Payment expiry: 24h (BIZ-08)
- No refund (BIZ-09)
- Currency: IDR (BIZ-10)

---

## 3. Customer Registration / Login Flow

**Actor**: Public visitor

### 3a. Registration

```
Any page with auth-required action (e.g., Add to Cart)
  |
  +--> Redirect to Login Page (/login)
  |
  +--> Click "Create Account"
  |
  +--> Registration Page (/register)
  |      |
  |      +--> Enter: name, email, phone, password, confirm password
  |      |
  |      +--> Validation:
  |      |      - Email format valid? No --> "Invalid email"
  |      |      - Email already registered? Yes --> "Email already registered. Login instead."
  |      |      - Phone format valid? No --> "Invalid phone number"
  |      |      - Password meets requirements? No --> "Password must be at least 8 characters"
  |      |      - Passwords match? No --> "Passwords do not match"
  |      |
  |      +--> Click "Register"
  |             |
  |             +--> Account created
  |             +--> Auto-login
  |             +--> Redirect to original destination (or dashboard)
```

### 3b. Login

```
Login Page (/login)
  |
  +--> Enter: email, password
  |
  +--> Click "Login"
  |      |
  |      +--> Credentials valid?
  |             |
  |             Yes --> Create session --> Redirect to original destination (or dashboard)
  |             No  --> "Invalid email or password." (generic, no info leak)
  |
  +--> "Forgot Password?" link
         |
         +--> Forgot Password Page (/forgot-password)
                |
                +--> Enter email
                +--> Click "Send Reset Link"
                |      |
                |      +--> Email registered?
                |             |
                |             Yes --> Send reset email --> "Check your email"
                |             No  --> "Check your email" (same message, no info leak)
                |
                +--> Reset Password Page (/reset-password?token=...)
                       |
                       +--> Token valid and not expired?
                       |      |
                       |      Yes --> Enter new password + confirm
                       |      No  --> "Link expired. Request a new one."
                       |
                       +--> Click "Reset Password"
                              |
                              +--> Password updated --> Redirect to Login
```

**Pages involved**:
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

---

## 4. Customer Dashboard Flow

**Actor**: Customer (authenticated)

```
Customer Dashboard (/dashboard)
  |
  +--> Upcoming Bookings (default view)
  |      |
  |      +--> List of bookings with status: confirmed, pending
  |      +--> Each item shows: product name, date, time, status, order number
  |      +--> Click booking --> Booking Detail Page
  |
  +--> Booking History (tab/filter)
  |      |
  |      +--> List of bookings with status: completed, cancelled, no_show
  |      +--> Sorted by date (most recent first)
  |      +--> Click booking --> Booking Detail Page
  |
  +--> Booking Detail Page (/dashboard/bookings/:bookingId)
  |      |
  |      +--> Show: product, date, time, location/room, instructor, status
  |      +--> Show: linked order number, payment status
  |      +--> Actions (conditional):
  |             |
  |             +--> Status = pending (unpaid)?
  |             |      +--> "Pay Now" --> Payment Page
  |             |      +--> "Cancel Booking" --> Cancellation Flow (section 6)
  |             |
  |             +--> Status = confirmed + within reschedule window (24h before)?
  |             |      +--> "Reschedule" --> Reschedule Flow (section 5)
  |             |
  |             +--> Status = confirmed + outside reschedule window?
  |             |      +--> No actions available. "Contact admin to reschedule."
  |             |
  |             +--> Status = completed/cancelled/no_show?
  |                    +--> No actions. Read-only view.
  |
  +--> Orders (tab)
  |      |
  |      +--> List of orders with: order number, date, total, status
  |      +--> Click order --> Order Detail
  |             |
  |             +--> Items in order, payment status, booking links
  |
  +--> Profile (/dashboard/profile)
         |
         +--> View/edit: name, email, phone
         +--> Change password
```

**Pages involved**:
- `/dashboard` — Overview / upcoming bookings
- `/dashboard/bookings/:bookingId` — Booking detail
- `/dashboard/orders` — Order list
- `/dashboard/orders/:orderId` — Order detail
- `/dashboard/profile` — Profile management

---

## 5. Reschedule Flow

**Actor**: Customer (authenticated)

```
Booking Detail Page (/dashboard/bookings/:bookingId)
  |
  +--> Booking status = confirmed?
  |      |
  |      Yes --> Continue
  |      No  --> Reschedule button not shown (flow not available)
  |
  +--> Is booking within reschedule window (>= 24h before scheduled time)?
  |      |
  |      Yes --> Show "Reschedule" button
  |      No  --> "Reschedule not available. Contact admin." (dead end for self-service)
  |
  +--> Has booking already been rescheduled once?
  |      |
  |      Yes --> "Maximum reschedules reached. Contact admin." (BIZ-06)
  |      No  --> Continue
  |
  +--> Click "Reschedule"
  |
  +--> Reschedule Page (/dashboard/bookings/:bookingId/reschedule)
  |      |
  |      +--> Show current booking: date, time
  |      +--> Show calendar with available dates (same product)
  |      |
  |      +--> Select new date
  |      |      |
  |      |      +--> Load available time slots
  |      |             |
  |      |             Slots found? Yes --> Show slots
  |      |             No --> "No availability on this date." --> Select another
  |      |
  |      +--> Select new time slot
  |      |
  |      +--> System validates new slot (resource availability)
  |      |      |
  |      |      Available? Yes --> Show reschedule summary
  |      |      No --> "Slot no longer available." --> Refresh
  |      |
  |      +--> Enter reason for reschedule (optional text field)
  |      |
  |      +--> Click "Confirm Reschedule"
  |             |
  |             +--> Original slot released
  |             +--> New slot booked
  |             +--> Reschedule log created (original, new, reason, timestamp)
  |             +--> Booking updated with new date/time
  |             +--> Email notification sent (reschedule confirmation)
  |             +--> Redirect to Booking Detail (updated)
```

**Pages involved**:
- `/dashboard/bookings/:bookingId` — Booking detail (entry point)
- `/dashboard/bookings/:bookingId/reschedule` — Reschedule date/time selection

**Error states**:
- Race condition: new slot taken between selection and confirmation --> "Slot no longer available. Please select another."
- Policy violation (< 24h or already rescheduled) --> Block with explanation

---

## 6. Cancellation Flow

**Actor**: Customer (authenticated)

```
Booking Detail Page (/dashboard/bookings/:bookingId)
  |
  +--> Booking status = pending (order not yet paid)?
  |      |
  |      Yes --> Show "Cancel Booking" button
  |      No  --> Cancel button not shown
  |             (Paid bookings cannot be cancelled in MVP — no refund policy)
  |
  +--> Click "Cancel Booking"
  |
  +--> Confirmation Dialog
  |      |
  |      "Are you sure you want to cancel this booking?
  |       This action cannot be undone."
  |      |
  |      +--> [Cancel] --> Dismiss dialog (no action)
  |      +--> [Confirm Cancellation] --> Proceed
  |
  +--> System processes cancellation:
  |      |
  |      +--> Booking status --> cancelled
  |      +--> Order status --> cancelled
  |      +--> Held slot released
  |      +--> Cancellation log created (actor, reason, timestamp)
  |      +--> Email notification sent (cancellation confirmation)
  |
  +--> Booking Detail Page updated (status: cancelled, read-only)
```

**Pages involved**:
- `/dashboard/bookings/:bookingId` — Booking detail (inline dialog)

**Business rules**:
- Cancellation ONLY allowed before payment (BIZ-04)
- No refund (BIZ-09) -- therefore no post-payment cancellation in MVP

---

## 7. School Inquiry Flow

**Actor**: School PIC (public visitor, no auth required)

```
School Programs Page (/school)
  |
  +--> Browse school program options (workshop, extracurricular, creative day, semester)
  |
  +--> Click "Inquire" or "Contact Us for School Programs"
  |
  +--> School Inquiry Form (/school/inquiry)
  |      |
  |      +--> Fields:
  |      |      - School name (required)
  |      |      - PIC name (required)
  |      |      - Email (required)
  |      |      - Phone (required)
  |      |      - Number of students (required)
  |      |      - Program interest (select from list, required)
  |      |      - Preferred dates (date picker, optional)
  |      |      - Additional notes (textarea, optional)
  |      |
  |      +--> Validation:
  |      |      - Required fields filled? No --> Highlight missing fields
  |      |      - Email valid? No --> "Invalid email"
  |      |      - Phone valid? No --> "Invalid phone number"
  |      |      - Student count > 0? No --> "Enter valid number"
  |      |
  |      +--> Click "Submit Inquiry"
  |             |
  |             +--> Inquiry created (status: new)
  |             +--> Admin notification email sent
  |             +--> Redirect to Thank You page
  |
  +--> Thank You Page (/school/inquiry/success)
         |
         +--> "Thank you. We will contact you within 2 business days."
         +--> CTA: "Back to Homepage"
```

### Admin Side of School Inquiry

```
Admin Dashboard --> School Inquiries (/admin/inquiries)
  |
  +--> List of inquiries with: school name, PIC, program, status, date
  +--> Filter by status: new, contacted, proposal_sent, confirmed, declined
  |
  +--> Click inquiry --> Inquiry Detail (/admin/inquiries/:id)
         |
         +--> View all submitted information
         +--> Update status:
         |      new --> contacted --> proposal_sent --> confirmed
         |                                         --> declined
         |
         +--> Add internal notes
         +--> Contact school via email/phone (external, not in-app for MVP)
```

**Pages involved**:
- `/school` — School programs page
- `/school/inquiry` — Inquiry form
- `/school/inquiry/success` — Thank you page
- `/admin/inquiries` — Admin inquiry list
- `/admin/inquiries/:id` — Admin inquiry detail

---

## 8. Admin Login Flow

**Actor**: Admin / Staff

```
Admin Login Page (/admin/login)
  |
  +--> Enter: email, password
  |
  +--> Click "Login"
  |      |
  |      +--> Credentials valid?
  |      |      |
  |      |      Yes --> Is user role admin/super_admin/staff?
  |      |      |        |
  |      |      |        Yes --> Create session --> Redirect to Admin Dashboard
  |      |      |        No  --> "Unauthorized. Admin access required."
  |      |      |
  |      |      No --> "Invalid email or password."
  |      |
  |      +--> Rate limiting: 5 failed attempts --> Lock for 15 min
  |
  +--> Session management:
         |
         +--> Session timeout after inactivity (configurable)
         +--> Logout --> Clear session --> Redirect to Admin Login
```

**Pages involved**:
- `/admin/login`
- `/admin` — Admin dashboard (post-login redirect)

**Error states**:
- Invalid credentials --> Generic error message
- Account locked (rate limit) --> "Too many attempts. Try again in 15 minutes."
- Insufficient role --> "Unauthorized"

---

## 9. Admin Product Management Flow

**Actor**: Admin (role: admin or super_admin)

```
Admin Sidebar --> Products (/admin/products)
  |
  +--> Product List
  |      |
  |      +--> Table: name, category, type, price, status, actions
  |      +--> Filter by: category, type, status
  |      +--> Search by name
  |
  +--> Create Product
  |      |
  |      +--> Click "Add Product" --> /admin/products/new
  |      |
  |      +--> Form fields:
  |      |      - Name (required)
  |      |      - Slug (auto-generated from name, editable)
  |      |      - Category (select: education, studio, services, school)
  |      |      - Type (select: class_enrollment, time_slot, appointment, event, project, order, b2b_inquiry)
  |      |      - Description (rich text)
  |      |      - Price (IDR, required)
  |      |      - Duration (minutes, required)
  |      |      - Capacity (max participants, required)
  |      |      - Images (upload, multiple)
  |      |      - Requirements (text)
  |      |      - What's included (text)
  |      |      - Required resources (select: rooms, equipment, instructors)
  |      |      - Status: draft (default)
  |      |
  |      +--> Validation:
  |      |      - Name required, unique
  |      |      - Slug unique
  |      |      - Price >= 0
  |      |      - Duration > 0
  |      |      - Capacity > 0
  |      |
  |      +--> Click "Save as Draft" or "Publish"
  |             |
  |             +--> Save as Draft --> status: draft (not visible to public)
  |             +--> Publish --> status: published (visible on public site)
  |             +--> Audit log entry created
  |             +--> Redirect to Product List
  |
  +--> Edit Product
  |      |
  |      +--> Click product row or edit icon --> /admin/products/:id/edit
  |      +--> Same form as create, pre-filled
  |      +--> Click "Save" --> Update product
  |      +--> Audit log entry created
  |
  +--> Change Product Status
  |      |
  |      +--> draft --> published (product goes live)
  |      +--> published --> archived (product hidden, existing bookings unaffected)
  |      +--> archived --> draft (can re-edit and re-publish)
  |
  +--> Delete Product
         |
         +--> Has existing bookings?
         |      |
         |      Yes --> Cannot delete. "Archive instead." (prevent data loss)
         |      No  --> Confirmation dialog --> Delete --> Audit log entry
```

**Pages involved**:
- `/admin/products` — Product list
- `/admin/products/new` — Create product
- `/admin/products/:id/edit` — Edit product

---

## 10. Admin Schedule Management Flow

**Actor**: Admin (role: admin or super_admin)

```
Admin Sidebar --> Schedules (/admin/schedules)
  |
  +--> Calendar View (weekly/monthly)
  |      |
  |      +--> Shows: scheduled slots, blocked times, existing bookings
  |      +--> Color-coded by type (available, booked, blocked)
  |
  +--> Create Schedule Template (recurring)
  |      |
  |      +--> Click "Add Schedule" --> /admin/schedules/new
  |      |
  |      +--> Form:
  |      |      - Product (select)
  |      |      - Day of week (select: Mon-Sat per BIZ-01)
  |      |      - Start time
  |      |      - End time
  |      |      - Recurrence: weekly
  |      |      - Effective date range (start date, optional end date)
  |      |      - Assigned resources: room, instructor, equipment
  |      |
  |      +--> Validation:
  |      |      - Time within operating hours (09:00-18:00, BIZ-01)?
  |      |      |      No --> "Outside operating hours"
  |      |      - Resource conflict with existing schedule?
  |      |      |      Yes --> "Conflict: [resource] already scheduled at this time"
  |      |      - Buffer time respected (BIZ-03)?
  |      |
  |      +--> Click "Save"
  |             +--> Schedule template created
  |             +--> Available slots generated from template
  |             +--> Audit log entry
  |
  +--> Create Specific Date Availability
  |      |
  |      +--> Click date on calendar --> Add availability for specific date
  |      +--> Form: product, date, start time, end time, resources
  |      +--> Overrides template for that date
  |
  +--> Block Date/Time
  |      |
  |      +--> Click "Block Time" --> /admin/schedules/block
  |      |
  |      +--> Form:
  |      |      - Date or date range
  |      |      - Time range (optional, full day if omitted)
  |      |      - Reason: holiday, maintenance, private event, other
  |      |      - Affected resources (specific or all)
  |      |
  |      +--> Has existing bookings in blocked period?
  |      |      |
  |      |      Yes --> Warning: "X bookings exist in this period. 
  |      |      |        They will need to be rescheduled manually."
  |      |      |        --> Admin must handle affected bookings separately
  |      |      No  --> Block applied
  |      |
  |      +--> Click "Block" --> Slot(s) marked unavailable
  |
  +--> Edit Schedule
  |      |
  |      +--> Click existing schedule --> Edit form
  |      +--> Changes affect future slots only (past bookings unaffected)
  |
  +--> Delete Schedule
         |
         +--> Future bookings exist on this schedule?
         |      |
         |      Yes --> Warning: must reschedule/cancel affected bookings first
         |      No  --> Confirmation --> Delete --> Audit log
```

**Pages involved**:
- `/admin/schedules` — Calendar view
- `/admin/schedules/new` — Create schedule template
- `/admin/schedules/block` — Block date/time

---

## 11. Admin Booking Management Flow

**Actor**: Admin (role: admin, super_admin, staff)

```
Admin Sidebar --> Bookings (/admin/bookings)
  |
  +--> Booking List
  |      |
  |      +--> Table: booking ID, customer, product, date, time, status, payment status
  |      +--> Filter by: status, date range, product, payment status
  |      +--> Search by: customer name, email, booking ID
  |      +--> Quick filter tabs: Today, Upcoming, Pending Payment, All
  |
  +--> View Booking Detail (/admin/bookings/:id)
  |      |
  |      +--> Booking info: product, date, time, room, instructor, status
  |      +--> Customer info: name, email, phone
  |      +--> Order info: order number, items, total, payment status
  |      +--> Reschedule history (if any)
  |      +--> Audit trail
  |
  +--> Confirm Booking
  |      |
  |      +--> Booking status = pending + payment = paid?
  |      |      |
  |      |      Yes --> Click "Confirm" --> status: confirmed
  |      |      |       --> Email notification to customer
  |      |      |       --> Audit log
  |      |      No  --> Cannot confirm (payment not received)
  |      |
  |      +--> Note: auto-confirm on payment webhook is the normal path.
  |             Manual confirm is fallback for edge cases.
  |
  +--> Cancel Booking (admin-initiated)
  |      |
  |      +--> Click "Cancel Booking"
  |      +--> Enter reason (required)
  |      +--> Confirmation dialog
  |      +--> Booking status --> cancelled
  |      +--> Slot released
  |      +--> Email notification to customer (with reason)
  |      +--> Audit log (actor: admin, reason)
  |      |
  |      +--> If booking was paid:
  |             Admin must handle offline (credit note, manual refund, etc.)
  |             System logs the cancellation but does not process refund.
  |
  +--> Reschedule Booking (admin-initiated)
  |      |
  |      +--> Click "Reschedule"
  |      +--> Select new date/time (same availability check as customer flow)
  |      +--> Enter reason
  |      +--> Confirm --> Original slot released, new slot assigned
  |      +--> Email notification to customer
  |      +--> Audit log
  |      +--> Note: admin reschedule bypasses 24h window and max-reschedule limit
  |
  +--> Mark as No-Show
  |      |
  |      +--> Booking date has passed + customer did not attend
  |      +--> Click "Mark No-Show" --> status: no_show
  |      +--> Audit log
  |
  +--> Mark as Completed
         |
         +--> Booking date has passed + service delivered
         +--> Click "Mark Completed" --> status: completed
         +--> Audit log
```

**Pages involved**:
- `/admin/bookings` — Booking list
- `/admin/bookings/:id` — Booking detail

---

## 12. Admin Order & Payment Flow

**Actor**: Admin (role: admin, super_admin)

```
Admin Sidebar --> Orders (/admin/orders)
  |
  +--> Order List
  |      |
  |      +--> Table: order number, customer, date, total, status, payment status
  |      +--> Filter by: status, date range, payment status
  |      +--> Search by: order number, customer name/email
  |
  +--> View Order Detail (/admin/orders/:id)
  |      |
  |      +--> Order info: items, quantities, prices, subtotal, tax, total
  |      +--> Customer info
  |      +--> Payment info: method, status, transaction ID, timestamps
  |      +--> Linked bookings (clickable to booking detail)
  |      +--> Audit trail
  |
  +--> Verify Payment (manual fallback)
  |      |
  |      +--> Normal path: payment gateway webhook auto-updates status.
  |      |
  |      +--> Fallback: webhook failed or bank transfer not auto-detected
  |      |      |
  |      |      +--> Admin checks payment proof / bank statement
  |      |      +--> Click "Verify Payment"
  |      |      +--> Enter: verification notes, transaction reference
  |      |      +--> Confirm
  |      |             |
  |      |             +--> Payment status --> paid
  |      |             +--> Order status --> paid
  |      |             +--> Booking status --> confirmed
  |      |             +--> Email notification to customer (payment confirmed)
  |      |             +--> Audit log (actor: admin, method: manual_verification)
  |      |
  |      +--> Mark as Failed
  |             |
  |             +--> Payment genuinely failed (bounced, fraud, etc.)
  |             +--> Click "Mark Failed" --> payment status: failed
  |             +--> Audit log
  |
  +--> Cancel Order
         |
         +--> Order status = awaiting_payment (not yet paid)?
         |      |
         |      Yes --> Click "Cancel Order"
         |              --> Order status: cancelled
         |              --> All linked bookings: cancelled
         |              --> Slots released
         |              --> Email notification
         |              --> Audit log
         |
         +--> Order status = paid?
                |
                Admin can cancel but must handle payment offline.
                System marks order cancelled, logs action.
                No automatic refund.
```

**Pages involved**:
- `/admin/orders` — Order list
- `/admin/orders/:id` — Order detail

---

## Flow Interconnections

```
CUSTOMER SIDE:

  Discovery --> Booking --> Payment --> Confirmation
                  |                        |
                  v                        v
              [Login required]      Customer Dashboard
                                     |           |
                                     v           v
                                 Reschedule  Cancellation
                                              (pre-pay only)

  School Page --> Inquiry Form --> Thank You


ADMIN SIDE:

  Admin Login --> Admin Dashboard
                    |
          +---------+---------+---------+---------+
          |         |         |         |         |
       Products  Schedules  Bookings  Orders   Inquiries
       (CRUD)    (template,  (view,    (view,   (review,
                  block)     confirm,  verify   contact)
                             cancel,   payment)
                             reschedule)
```

---

## Status Lifecycle Reference

### Booking Statuses
```
pending --> confirmed --> in_progress --> completed
  |            |
  |            +--> cancelled (admin only for paid)
  |            +--> no_show
  |
  +--> cancelled (customer, pre-payment only)
```

### Order Statuses
```
pending --> awaiting_payment --> paid --> fulfilled
  |              |                |
  |              +--> cancelled   +--> cancelled (admin, offline refund)
  |
  +--> cancelled
```

### Payment Statuses
```
pending --> waiting --> paid
                |
                +--> failed (retry possible)
                +--> expired (24h, auto-cancel)
```

### School Inquiry Statuses
```
new --> contacted --> proposal_sent --> confirmed
                                   --> declined
```
