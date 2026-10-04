# Noire Space — Business Requirement Document (BRD)

## 1. Executive Summary

**Noire Space** membangun platform digital untuk commerce, booking, dan operations management. Platform ini melayani creative technology education, studio rental, dan creative services dengan target audience generasi muda dan sekolah.

**Core Value Proposition**: LEARN. CREATE. EARN.

**MVP Goal**: Customer dapat menemukan layanan, booking, bayar, dan mendapatkan konfirmasi. Admin dapat mengelola seluruh operasional.

---

## 2. Business Objectives

| # | Objective | Success Metric |
|---|-----------|----------------|
| BO-01 | Customer dapat booking online | Booking conversion rate > 0 |
| BO-02 | Eliminate scheduling conflicts | Zero double bookings |
| BO-03 | Reduce admin manual work | Admin time per booking < 2 min |
| BO-04 | Online payment collection | Payment success rate > 90% |
| BO-05 | Customer self-service | 80% bookings tanpa bantuan admin |

---

## 3. Stakeholders

| Role | Description |
|------|-------------|
| Customer | End-user yang booking layanan (individu, orang tua, sekolah) |
| Admin | Mengelola operasional, produk, jadwal, booking |
| Staff | Operasional harian, check-in, support |
| Instructor | Mengajar program, mentoring (managed by admin in MVP) |
| School PIC | Contact person sekolah untuk program B2B |

---

## 4. Product Types

### 4.1 Education Programs
| Product | Duration | Capacity | Booking Type |
|---------|----------|----------|--------------|
| Junior Creator | Multi-session | 10-15 | Class enrollment |
| Young Creator | Multi-session | 10-15 | Class enrollment |
| Creator Pro | Multi-session | 10-15 | Class enrollment |
| Private Mentoring | 60-120 min | 1 | Appointment |
| Workshop | 2-4 hours | 15-20 | Event |
| Bootcamp | Multi-day | 15-20 | Event |

### 4.2 Studio Services
| Product | Duration | Capacity | Booking Type |
|---------|----------|----------|--------------|
| Studio 30 min | 30 min | 1 group | Time slot |
| Studio 60 min | 60 min | 1 group | Time slot |
| Studio 120 min | 120 min | 1 group | Time slot |
| Business Content Package | Custom | 1 client | Package |

### 4.3 Creative Services
| Product | Duration | Capacity | Booking Type |
|---------|----------|----------|--------------|
| Product Photography | Custom | 1 client | Project |
| Portrait Photography | 60-120 min | 1 client | Appointment |
| Content Production | Custom | 1 client | Project |
| AI Editing | Async | 1 client | Order |

### 4.4 School Programs
| Product | Duration | Capacity | Booking Type |
|---------|----------|----------|--------------|
| School Workshop | Half/full day | 20-40 | B2B inquiry |
| Creative Extracurricular | Semester | 15-20 | B2B inquiry |
| Creative Day | Full day | 30-60 | B2B inquiry |
| Semester Program | Semester | 15-20 | B2B inquiry |

---

## 5. Functional Requirements

### FR-01: Product Catalog
- Admin CRUD products dengan: name, slug, description, type, category, price, duration, capacity, images, status, requirements, includes
- Products grouped by category
- Product detail page dengan semua informasi
- Product status: draft, published, archived

### FR-02: Availability & Scheduling
- Admin membuat schedule templates (recurring weekly)
- Admin membuat specific date availability
- Admin block dates/times (holiday, maintenance)
- System menghitung available slots berdasarkan: schedule + existing bookings + resource availability
- Customer melihat available dates pada calendar
- Customer memilih time slot dari available slots
- Buffer time antar booking (configurable)

### FR-03: Resource Management
- Resources: rooms, equipment, instructors
- Each resource: name, type, status (active/inactive), capacity
- Resources linked to products (product X requires room Y + instructor Z)
- Availability check considers all required resources

### FR-04: Booking
- Customer selects: product → date → time → options → cart
- System validates availability at add-to-cart AND at checkout
- Booking statuses: pending, confirmed, in_progress, completed, cancelled, no_show
- Booking holds slot temporarily during checkout (15 min expiry)
- Booking links to: customer, product, date, time, room, instructor, resources

### FR-05: Cart & Order
- Cart: multiple items, persisted per customer
- Cart validates availability before checkout
- Order created from cart at checkout
- Order: order_number, items, subtotal, discount, tax, total, status
- Order statuses: pending, awaiting_payment, paid, partially_paid, fulfilled, cancelled

### FR-06: Payment
- Payment created from order
- Payment gateway abstraction (adapter pattern)
- Payment statuses: pending, waiting, paid, failed, expired
- Payment callback/webhook handling (idempotent)
- Payment proof/receipt
- Manual payment verification by admin (fallback)
- NO REFUND

### FR-07: Cancellation & Reschedule
- Cancel: allowed only before payment (MVP)
- Reschedule: allowed if within policy window (e.g., 24h before)
- Reschedule checks new slot availability
- Reschedule logs: original, new, reason, actor, timestamp
- Policy configurable by admin

### FR-08: Customer Account
- Registration: name, email, phone, password
- Login: email + password
- Profile management
- Dashboard: upcoming bookings, history, orders, payments
- Booking detail view

### FR-09: Admin Dashboard
- Today overview: bookings, payments, classes, alerts
- Quick actions: confirm booking, mark payment, view conflicts
- Stats: revenue (daily/weekly/monthly), booking count, utilization

### FR-10: Admin Management
- CRUD: products, categories, rooms, resources, instructors
- Schedule management: create, edit, block
- Booking management: view, confirm, cancel, reschedule
- Order management: view, update status
- Payment management: view, verify, mark paid
- Customer management: view, search, history
- Settings: business hours, policies, site config

### FR-11: Notification
- Email notifications for: booking created, payment received, booking confirmed, upcoming reminder, reschedule, cancellation
- Notification templates (admin editable in Phase 2)
- MVP: email only. Phase 2: WhatsApp, in-app

### FR-12: School Inquiry (MVP-lite)
- Public form: school name, PIC, email, phone, students count, program interest, preferred dates, notes
- Admin receives inquiry notification
- Admin manages inquiries in dashboard
- Status: new, contacted, proposal_sent, confirmed, declined
- Full B2B flow (proposal builder, invoice) = Phase 2

### FR-13: RBAC
- Roles: super_admin, admin, staff
- Permissions: granular per module (products.create, bookings.update, etc.)
- Super admin: all access
- Admin: operational access
- Staff: limited (view bookings, check-in, basic ops)

### FR-14: Audit Log
- Log critical actions: create/update/delete on bookings, orders, payments, products, schedules
- Fields: actor, action, entity_type, entity_id, before, after, timestamp, ip

### FR-15: SEO
- Semantic HTML, meta tags, Open Graph
- SEO-friendly URLs (/programs/creator-pro, /studio/60-minutes)
- Sitemap.xml, robots.txt
- Structured data (LocalBusiness, Course, Event)
- Image optimization (WebP, lazy load)

---

## 6. Non-Functional Requirements

| # | Requirement | Target |
|---|-------------|--------|
| NFR-01 | Page load time | < 3s (LCP) |
| NFR-02 | Mobile responsive | All public pages |
| NFR-03 | Uptime | 99.5% |
| NFR-04 | Concurrent users | 100 (MVP) |
| NFR-05 | Data backup | Daily |
| NFR-06 | Security | OWASP Top 10 compliance |
| NFR-07 | Browser support | Chrome, Safari, Firefox (latest 2 versions) |

---

## 7. Business Rules

| # | Rule | Configurable |
|---|------|-------------|
| BIZ-01 | Operating hours: Mon-Sat 09:00-18:00 | Yes |
| BIZ-02 | Booking window: 1 day to 30 days ahead | Yes |
| BIZ-03 | Buffer time between bookings: 15 min | Yes |
| BIZ-04 | Cancellation: only before payment. Setelah bayar: hanya reschedule | Yes |
| BIZ-05 | Reschedule window: 24h before booking | Yes |
| BIZ-06 | Max reschedule per booking: 1 | Yes |
| BIZ-07 | Checkout hold: 15 min | Yes |
| BIZ-08 | Payment expiry: 24h | Yes |
| BIZ-09 | No refund | No |
| BIZ-10 | Currency: IDR | No (MVP) |

---

## 8. Out of Scope (MVP)

- LMS / learning management
- Student portfolio
- Parent portal
- Creator marketplace
- Membership/loyalty
- Multi-language
- Multi-location
- Advanced analytics
- AI recommendation
- Digital certificate
- Community features
- Mobile app
- Full B2B invoice workflow
