# Noire Space — Requirement Analysis

## 1. Requirement Conflict Analysis

### CONFLICT-01: Product vs Service Abstraction Overlap
- **Brief**: Sections 6 dan 26 menyebut "product/service" secara interchangeable, tapi Section 9 memisahkan Cart → Order → Booking.
- **Problem**: Apakah semua product types (education, studio, creative services, school program) menggunakan flow yang sama? School Program (Section 16) punya flow B2B yang berbeda total dari retail checkout.
- **Recommendation**: Gunakan satu `Product` entity dengan `type` discriminator. Tapi **School Program** harus punya flow terpisah (inquiry → proposal → invoice) yang TIDAK melewati Cart/Checkout. Dua flow: **Retail Flow** dan **B2B Flow**.
- **Trade-off**: Dua flow = lebih banyak code, tapi memaksa school booking ke retail flow = UX buruk.

### CONFLICT-02: No Refund vs Cancellation
- **Brief**: Section 11 tegas NO REFUND. Section 12 mengizinkan cancellation.
- **Problem**: Jika customer sudah bayar lalu cancel, uangnya kemana? Tanpa refund, cancellation yang sudah paid = customer kehilangan uang. Ini bisa jadi masalah legal/reputasi.
- **Recommendation**: Cancellation sebelum payment = OK. Cancellation setelah payment = konversi ke **credit/voucher** (bukan refund tunai). Atau cancellation setelah payment = NOT ALLOWED, hanya reschedule.
- **Trade-off**: Credit system = tambahan complexity. Tapi "bayar lalu hilang" = bad customer experience.

### CONFLICT-03: MVP Scope vs Feature List
- **Brief**: Section 4 bilang "fokus COMMERCE + BOOKING + PAYMENT + OPERATIONS". Tapi feature list-nya sangat luas: waitlist, recommendation logic, school B2B flow, capacity management, resource management, notification multi-channel.
- **Problem**: Ini bukan MVP. Ini medium-sized product.
- **Recommendation**: Pisahkan tegas MVP-core vs MVP-nice-to-have. Lihat MVP boundary di bawah.

### CONFLICT-04: Experience-Driven Discovery vs MVP
- **Brief**: Section 8 minta recommendation logic ("user bilang X, sistem suggest Y").
- **Problem**: Recommendation engine bukan MVP. Ini butuh data, testing, dan iteration.
- **Recommendation**: MVP = static curated categories dengan manual tagging. Phase 2 = smart recommendation.

---

## 2. Missing Requirements

### MISSING-01: Pricing Model
- Tidak ada detail tentang pricing structure. Apakah fixed price? Tiered? Per-hour? Package? Discount rules?
- **Need**: Pricing model definition. MVP = fixed price per product. Phase 2 = dynamic pricing, packages, bundles.

### MISSING-02: Multi-location
- Brief menyebut "Location" di booking model tapi tidak menjelaskan apakah Noire Space punya multiple locations.
- **Assumption for MVP**: Single location. Schema siap multi-location.

### MISSING-03: Operating Hours Definition
- Section 13 menyebut "business hours" tapi tidak mendefinisikan.
- **Need**: Default operating hours, per-resource hours, timezone.

### MISSING-04: Payment Gateway Choice
- Section 10 bilang "jangan hard-code provider" tapi tidak menyebut provider target.
- **Assumption**: Indonesia-based = Midtrans atau Xendit sebagai primary. Architecture = payment adapter pattern.

### MISSING-05: Currency
- Tidak disebut. 
- **Assumption**: IDR (Indonesian Rupiah), single currency for MVP.

### MISSING-06: Language
- Tidak disebut apakah bilingual.
- **Assumption**: Indonesian primary, English secondary. MVP = single language (ID atau EN). Phase 2 = i18n.

### MISSING-07: Image/Media Management
- Products butuh photos, portfolio, dll. Tidak ada spec tentang media storage.
- **Need**: Image upload, storage (S3/R2), optimization, CDN.

### MISSING-08: Email/Auth Provider
- Tidak disebut auth method.
- **Assumption**: Email + password. Phase 2 = social login, OTP.

### MISSING-09: Instructor Availability
- Section 13 menyebut instructor sebagai resource tapi tidak menjelaskan apakah instructor mengelola availability sendiri.
- **Assumption MVP**: Admin mengelola semua availability. Phase 2 = instructor self-service.

### MISSING-10: Tax/Invoice Compliance
- Section 9 menyebut "Tax jika diperlukan". Indonesia punya aturan pajak.
- **Assumption MVP**: Tax configurable per product (optional). Invoice = simple receipt. Bukan faktur pajak resmi.

---

## 3. Business Risk

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| BR-01 | No refund policy dapat menyebabkan complaint & bad review | High | Implement credit/voucher system sebagai alternatif |
| BR-02 | School B2B flow terlalu manual | Medium | MVP = form submission + admin manual. Phase 2 = proposal builder |
| BR-03 | Scope creep dari "ecosystem" vision | High | Strict MVP boundary. YAGNI. |
| BR-04 | Payment gateway integration delay | High | Build with mock payment first, integrate real gateway parallel |
| BR-05 | Single point of failure jika hanya 1 admin | Medium | RBAC dari awal, multiple admin support |

---

## 4. Technical Risk

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| TR-01 | Availability engine complexity | High | Start simple: date + time + resource check. Optimize later |
| TR-02 | Double booking race condition | High | Database-level locking/unique constraint pada booking slot |
| TR-03 | Payment callback reliability | High | Idempotent payment handler, webhook retry, manual verification |
| TR-04 | Performance pada availability check | Medium | Index properly, cache business hours, limit date range query |
| TR-05 | Over-normalized database | Medium | Pragmatic normalization. Denormalize for read performance where needed |

---

## 5. MVP Boundary

### MVP-CORE (Must Have)
- Public website (homepage, catalog, detail, about, contact, FAQ)
- Product/Service catalog dengan categories
- Static availability display (calendar-based)
- Resource-based booking (room + instructor + time)
- Double booking prevention
- Cart & checkout (retail flow)
- Payment integration (1 gateway)
- Booking confirmation
- Customer registration & login
- Customer dashboard (upcoming, history)
- Reschedule (admin-managed)
- Cancellation (pre-payment only)
- Admin dashboard (overview)
- Admin CRUD: products, rooms, resources, instructors, schedules
- Admin booking management
- Admin order & payment management
- RBAC (super admin, admin, staff)
- Email notification (booking, payment)
- Basic SEO
- Responsive / mobile-first
- Audit log for critical actions

### MVP-DEFERRED (Phase 2)
- School B2B flow (inquiry → proposal → invoice)
- Waitlist
- Recommendation engine
- WhatsApp notification
- Instructor self-service
- Advanced reporting
- Discount/promo system
- Multi-location
- Credit/voucher system (for cancellation)
- Advanced capacity management with real-time counter

### FUTURE (Phase 3+)
- Student/enrollment system
- Parent portal
- Creator marketplace
- Membership/loyalty
- Portfolio builder
- Digital certificate
- AI recommendation
- Community features
- Analytics dashboard
- i18n

---

## 6. Critical Decisions Needed

| # | Decision | Chosen | Notes |
|---|----------|--------|-------|
| D-01 | Cancellation after payment | **(A) Not allowed, only reschedule** | Tidak ada refund, tidak ada cancellation setelah bayar |
| D-02 | Payment gateway | **Midtrans** | Primary gateway. Adapter pattern tetap dipakai untuk extensibility |
| D-03 | Primary language | **Indonesian** | Konten & UI dalam Bahasa Indonesia |
| D-04 | Tech stack | **Next.js + Supabase PostgreSQL + Drizzle** | Lihat 07-technical-architecture.md |
| D-05 | School program in MVP? | **(B) Simple inquiry form** | Full B2B flow = Phase 2 |
| D-06 | Database hosting | **Supabase** | PostgreSQL via Supabase, siap migrasi ke self-hosted PostgreSQL |
