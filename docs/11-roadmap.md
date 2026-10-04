# 11 - Implementation Roadmap

Phased delivery plan for Noire Space MVP. 16 weeks to production. Each phase builds on the previous.

---

## Phase 0: Foundation (Week 1-2)

Objective: Project skeleton, database, auth, and admin shell. Nothing user-facing yet.

### Tasks

| # | Task | Details |
|---|------|---------|
| 0.1 | Project setup | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier |
| 0.2 | Database setup | PostgreSQL on Neon, Drizzle ORM, initial schema (users, roles, settings) |
| 0.3 | Auth setup | Auth.js v5, credentials provider, registration, login, logout |
| 0.4 | RBAC foundation | Role middleware, route protection for `(admin)`, `(customer)`, `(public)` route groups |
| 0.5 | Admin layout | Sidebar navigation, header, breadcrumbs, responsive shell |
| 0.6 | Seed data | Admin user, default operating hours, initial categories |
| 0.7 | Dev tooling | Drizzle Studio access, environment variable setup, git hooks (lint-staged) |

### Deliverables

- Admin can log in and see an empty dashboard
- Customer can register, log in, see an empty customer area
- Public pages return placeholder content
- Database schema deployed with seed data
- CI pipeline running lint and typecheck

---

## Phase 1: Catalog and Resources (Week 3-4)

Objective: Admin can manage products and resources. Public can browse the catalog.

### Tasks

| # | Task | Details |
|---|------|---------|
| 1.1 | Product schema | Products, categories, product images tables |
| 1.2 | Admin: Product CRUD | Create, read, update, archive products. Form with Zod validation. |
| 1.3 | Admin: Category CRUD | Manage product categories |
| 1.4 | Admin: Room CRUD | Manage rooms (name, capacity, status) |
| 1.5 | Admin: Resource CRUD | Manage resources (name, quantity, status) |
| 1.6 | Admin: Instructor CRUD | Manage instructors (name, bio, specializations, photo) |
| 1.7 | Image upload | Upload product/instructor images to external storage |
| 1.8 | Public: Catalog page | Product listing with category filter, search |
| 1.9 | Public: Product detail | Full product info, images, pricing, requirements |
| 1.10 | SEO setup | Meta tags, Open Graph, structured data (JSON-LD) for products |

### Deliverables

- Admin can create and manage full product catalog
- Admin can manage rooms, resources, and instructors
- Public can browse products by category
- Product detail pages are indexed by search engines

---

## Phase 2: Scheduling and Availability (Week 5-6)

Objective: Admin can manage schedules. System calculates available time slots. Double booking prevention works.

### Tasks

| # | Task | Details |
|---|------|---------|
| 2.1 | Schedule schema | Schedules, blocked dates, business hours tables |
| 2.2 | Admin: Business hours | Configure operating hours per location |
| 2.3 | Admin: Blocked dates | Mark dates as unavailable (holidays, maintenance) |
| 2.4 | Admin: Schedule management | Create schedules linking product + room + instructor + time |
| 2.5 | Availability engine | Calculate available slots from schedules, existing bookings, buffer time, capacity |
| 2.6 | Double booking prevention | DB constraints + application logic for room/instructor/resource uniqueness |
| 2.7 | Public: Availability calendar | Date picker on product detail showing available slots |
| 2.8 | Availability API | `GET /api/availability?productId=...&date=...` endpoint |

### Deliverables

- Admin can set business hours and blocked dates
- Admin can create schedules for products
- Customers can see available slots on product detail page
- Double booking is impossible (tested under concurrency)

---

## Phase 3: Booking and Commerce (Week 7-9)

Objective: Full booking and order flow. Cart, checkout, booking management, customer dashboard.

### Tasks

| # | Task | Details |
|---|------|---------|
| 3.1 | Cart system | Add to cart with slot hold (15 min), remove, update. Cart stored server-side. |
| 3.2 | Cart UI | Cart drawer/page, hold timer display, slot release on expiry |
| 3.3 | Checkout flow | Review order, confirm details, proceed to payment |
| 3.4 | Order creation | Create order + order items + booking records in single transaction |
| 3.5 | Order schema | Orders, order items tables with status tracking |
| 3.6 | Booking schema | Bookings table with status, linked to order item, schedule, customer |
| 3.7 | Admin: Booking list | View all bookings, filter by status/date/product, search |
| 3.8 | Admin: Booking detail | View details, change status, mark no-show |
| 3.9 | Admin: Order list | View all orders, filter by status, search |
| 3.10 | Admin: Order detail | View order items, payment status, apply discount |
| 3.11 | Customer: Dashboard | Upcoming bookings, recent orders, quick actions |
| 3.12 | Customer: Booking history | Past bookings with status |
| 3.13 | Customer: Order history | Past orders with payment status |
| 3.14 | Reschedule | Customer requests reschedule (24h rule, max 1x). Validates new slot availability. |
| 3.15 | Cancellation | Cancel unpaid orders. Release held slots. Update booking status. |

### Deliverables

- Customer can add products to cart, checkout, and create orders
- Slot hold prevents conflicts during checkout
- Admin can manage all bookings and orders
- Customer can view their bookings and orders
- Reschedule and cancellation work within policy rules

---

## Phase 4: Payment (Week 10-11)

Objective: Online payment works end to end. Webhooks update order and booking status.

### Tasks

| # | Task | Details |
|---|------|---------|
| 4.1 | Payment adapter interface | Define abstract payment interface (create charge, check status, verify webhook) |
| 4.2 | Midtrans implementation | Implement adapter for Midtrans Snap (or Xendit) |
| 4.3 | Payment creation | Generate payment link/token after order creation |
| 4.4 | Payment redirect | Redirect customer to payment page, handle return URL |
| 4.5 | Webhook handler | `POST /api/webhooks/payment` — verify signature, update payment status |
| 4.6 | Status cascade | Payment confirmed -> order paid -> booking confirmed (automatic) |
| 4.7 | Payment expiry | Auto-expire unpaid orders after 24h, release slots |
| 4.8 | Payment schema | Payments table with gateway reference, status, amount, metadata |
| 4.9 | Admin: Payment list | View payments, filter by status, link to order |
| 4.10 | Payment retry | Handle failed payments, allow customer to retry |

### Deliverables

- Customer can pay for orders via Midtrans (or Xendit)
- Payment webhook updates order and booking status automatically
- Expired payments cancel orders and release slots
- Admin can view all payments and their status
- Payment gateway can be swapped by implementing a new adapter

---

## Phase 5: Notifications and Polish (Week 12-13)

Objective: Email notifications, school inquiries, admin dashboard, and UI polish.

### Tasks

| # | Task | Details |
|---|------|---------|
| 5.1 | Email service | Resend integration, email templates (React Email or plain HTML) |
| 5.2 | Booking confirmation email | Sent when booking is confirmed (payment received) |
| 5.3 | Payment reminder email | Sent if payment not received within 12h (optional) |
| 5.4 | Order confirmation email | Sent after order creation with payment instructions |
| 5.5 | School inquiry form | Public form: school name, PIC, program interest, preferred dates |
| 5.6 | Admin: Inquiry management | View inquiries, update status (new -> contacted -> proposal_sent -> confirmed/declined) |
| 5.7 | Admin: Dashboard | Stats overview: bookings today, revenue this month, pending orders, recent activity |
| 5.8 | Admin: Basic reports | Revenue by period, bookings by product, popular time slots |
| 5.9 | Audit log | Record admin actions, status changes, login events. View in admin. |
| 5.10 | Static pages | About, FAQ, contact, terms of service, privacy policy |
| 5.11 | Mobile responsive | Test and fix all pages on mobile viewports |
| 5.12 | SEO finalization | Sitemap, robots.txt, meta tags review, structured data validation |
| 5.13 | Loading states | Skeleton loaders, optimistic updates, error boundaries |
| 5.14 | Accessibility | Keyboard navigation, ARIA labels, color contrast check |

### Deliverables

- Customers receive email notifications for key events
- Schools can submit inquiry forms
- Admin has a functional dashboard with basic analytics
- All pages responsive and polished
- SEO ready for launch

---

## Phase 6: Testing and Launch (Week 14-16)

Objective: Test critical paths, fix bugs, optimize performance, deploy to production.

### Tasks

| # | Task | Details |
|---|------|---------|
| 6.1 | Unit tests | Availability engine, pricing, booking validation, status transitions |
| 6.2 | Integration tests | API routes, database operations, webhook handling, RBAC |
| 6.3 | E2E tests | Booking flow, payment flow, admin CRUD, customer dashboard |
| 6.4 | Security review | Input validation audit, RBAC audit, header check, dependency audit |
| 6.5 | Performance | Lighthouse audit, image optimization, bundle size review, query optimization |
| 6.6 | Staging deployment | Full deployment to staging environment with production-like config |
| 6.7 | UAT | Business stakeholder testing against staging. Bug fixes from feedback. |
| 6.8 | Production deployment | Deploy to production. Verify all checklist items (see `10-deployment.md`). |
| 6.9 | Post-launch monitoring | Monitor error rates, performance, and uptime for 1 week |
| 6.10 | Bug fix sprint | Address issues found during first week of production |

### Deliverables

- All critical business logic has test coverage
- Security review completed and issues resolved
- Staging tested and signed off by stakeholders
- Production live at `noirespace.com`
- Monitoring and alerting active

---

## Future Phases

### Phase 2.0: B2B and Engagement

| Feature | Description |
|---------|-------------|
| School B2B full flow | Automated proposal generation, contract management, bulk booking |
| Waitlist | Join waitlist for full classes, auto-notify when slot opens |
| WhatsApp notifications | Booking confirmations and reminders via WhatsApp (Fonnte or official API) |
| Promo codes | Coupon system with rules (expiry, usage limits, minimum order) |
| Reviews and ratings | Customer reviews on products after completion |

### Phase 3.0: User Ecosystem

| Feature | Description |
|---------|-------------|
| Student system | Student profiles, progress tracking, certificates, portfolio |
| Parent portal | Parent links to child account, views progress, manages bookings |
| Instructor self-service | Instructors manage own availability, view schedule, track sessions |
| Attendance tracking | QR code check-in, attendance history, absence alerts |
| Multi-location | Support multiple physical locations with separate resources and hours |

### Phase 4.0: Platform Growth

| Feature | Description |
|---------|-------------|
| Creator marketplace | Students sell their creative work through the platform |
| Membership plans | Monthly/annual subscriptions with included sessions and discounts |
| Community | Forum or social feed for students and creators |
| Mobile app | React Native or PWA for customer booking and engagement |
| Analytics dashboard | Advanced reporting, cohort analysis, revenue forecasting |
| API platform | Public API for third-party integrations |
