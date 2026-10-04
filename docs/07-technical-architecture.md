# 07 - Technical Architecture

Technical architecture for Noire Space. MVP-focused, pragmatic choices. No over-engineering.

---

## Recommended Stack

| Layer        | Technology                        | Notes                                |
|--------------|-----------------------------------|--------------------------------------|
| Frontend     | Next.js 14+ (App Router)         | TypeScript, Tailwind CSS, shadcn/ui  |
| Backend      | Next.js API Routes + Server Actions | Monorepo, no separate backend      |
| Database     | PostgreSQL                        | Via Supabase (migrasi ke self-hosted PostgreSQL ready) |
| ORM          | Drizzle ORM                       | Lightweight, type-safe, SQL-like     |
| Auth         | NextAuth.js v5 (Auth.js)          | Credentials + OAuth ready           |
| Payment      | Adapter pattern                   | Midtrans as primary implementation   |
| Email        | Resend                            | Fallback: Nodemailer                 |
| Storage      | Cloudflare R2 or Uploadthing      | Image/file uploads                   |
| Deployment   | Vercel                            | Edge + serverless                    |
| Validation   | Zod                               | Shared client/server schemas         |

---

## Architecture Decisions

### Next.js monolith for MVP

Single deployable unit. No API/frontend split. Server Actions handle mutations, API routes handle webhooks and external integrations. Split into microservices later only if traffic demands it. For MVP, deployment simplicity and development speed outweigh separation of concerns.

### Server Components vs Client Components

Server Components for all SEO-critical pages: homepage, catalog, product detail, instructor profiles. These render on the server with zero client JS. Client Components only where interactivity is required: booking calendar, cart, checkout flow, admin dashboard forms.

### Drizzle over Prisma

Drizzle is lighter, faster at build time, and produces SQL-like syntax that is easier to reason about. No query engine binary. Type inference from schema definition. Raw SQL escape hatch when needed. Prisma's migration tooling is better, but Drizzle Kit is sufficient for MVP.

### PostgreSQL

Relational data model with strong consistency. ACID transactions are critical for booking conflict prevention (double-booking). JSONB columns for flexible metadata (product images, specializations, gateway responses) without needing a document store. Supabase provides managed PostgreSQL with connection pooling, built-in auth (not used — we use Auth.js), and easy migration path to self-hosted PostgreSQL when needed.

### shadcn/ui

Not installed as a dependency. Components are copied into the project and owned by the team. Full control over styling and behavior. No version lock-in. Consistent design system built on Radix UI primitives and Tailwind CSS.

### Payment adapter pattern

Abstract payment interface. Midtrans as primary implementation. Adding a new gateway means implementing one interface. Webhook handlers are gateway-specific but route through a common order status updater.

### Auth.js v5

Session management via JWT stored in HTTP-only cookies. Credentials provider for email/password. OAuth providers (Google) added later. Role and permission data embedded in session token for RBAC checks without extra DB queries per request.

---

## Project Structure

Modular monolith. Business logic organized by domain module. Shared infrastructure in `lib/`. UI components separate from business logic.

```
src/
  app/
    (public)/                 Public pages
      page.tsx                Homepage
      catalog/
        [slug]/page.tsx       Product detail
      instructors/page.tsx    Instructor listing
    (auth)/
      login/page.tsx
      register/page.tsx
    (customer)/
      dashboard/page.tsx
      bookings/page.tsx
      orders/page.tsx
    (admin)/
      dashboard/page.tsx
      products/page.tsx
      bookings/page.tsx
      orders/page.tsx
      schedules/page.tsx
      rooms/page.tsx
      instructors/page.tsx
      school-inquiries/page.tsx
      settings/page.tsx
    api/
      webhooks/
        payment/route.ts      Payment gateway webhooks
      auth/[...nextauth]/route.ts

  lib/
    db/
      index.ts                Drizzle client + connection
      schema/                 Drizzle table definitions (mirrors ERD)
      migrations/             SQL migration files

    modules/
      auth/
        auth.config.ts        Auth.js configuration
        rbac.ts               Permission checking utilities
        session.ts            Session helpers

      catalog/
        catalog.service.ts    Product/category queries
        catalog.actions.ts    Server Actions (admin CRUD)

      booking/
        booking.service.ts    Create, cancel, reschedule
        availability.ts       Availability calculation engine
        conflict.ts           Double-booking prevention

      commerce/
        cart.service.ts       Cart management
        order.service.ts      Order lifecycle
        checkout.ts           Cart -> Order -> Payment flow

      payment/
        payment.types.ts      Payment adapter interface
        payment.service.ts    Gateway-agnostic payment logic
        gateways/
          midtrans.ts         Midtrans implementation

      scheduling/
        schedule.service.ts   Schedule CRUD
        slot-generator.ts     Generate available time slots

      resource/
        room.service.ts
        resource.service.ts
        instructor.service.ts

      customer/
        customer.service.ts

      notification/
        notification.service.ts
        channels/
          email.ts
          whatsapp.ts

      audit/
        audit.service.ts      Log actions

      school/
        inquiry.service.ts

      settings/
        settings.service.ts

    utils/
      format.ts               Date, currency formatting
      id.ts                   ID generation (booking numbers, etc.)
      errors.ts               Custom error classes

    validators/
      booking.ts              Zod schemas for booking
      catalog.ts              Zod schemas for products
      auth.ts                 Zod schemas for auth forms
      payment.ts              Zod schemas for payment

  components/
    ui/                       shadcn/ui primitives (Button, Dialog, etc.)
    layout/
      header.tsx
      footer.tsx
      admin-sidebar.tsx
      customer-sidebar.tsx
    features/
      booking/
        booking-calendar.tsx
        time-slot-picker.tsx
        booking-form.tsx
      catalog/
        product-card.tsx
        product-grid.tsx
        category-filter.tsx
      cart/
        cart-sheet.tsx
        cart-item.tsx
      checkout/
        checkout-form.tsx
        payment-method-select.tsx
      admin/
        data-table.tsx
        stat-card.tsx

  hooks/
    use-cart.ts
    use-booking.ts

  types/
    index.ts                  Shared TypeScript types
```

---

## Security Architecture

### Server-side validation

All mutations validate input with Zod on the server. Client-side validation is for UX only and never trusted. Server Actions and API routes both validate before processing.

### Authentication and authorization

- Auth.js manages sessions via JWT in HTTP-only, secure, SameSite cookies.
- Passwords hashed with bcrypt (cost factor 10+).
- RBAC middleware checks permissions before Server Actions and API route execution.
- Admin routes protected by middleware that checks session role.

### Payment security

- Webhook endpoints verify gateway signatures (Midtrans: SHA-512 server key hash).
- Payment amounts are server-calculated, never from client.
- Idempotency keys prevent duplicate payment processing.

### General

- CSRF protection via Next.js built-in SameSite cookie policy and origin checking.
- Rate limiting middleware on auth endpoints and payment webhooks.
- SQL injection prevented by Drizzle parameterized queries. No raw string concatenation.
- Input sanitization for user-generated content displayed in HTML.
- Secrets stored in environment variables, never in code or client bundles.

---

## Performance Strategy

### Server-side rendering

Server Components render on the server. Homepage, catalog, and product pages ship zero client JavaScript for their static portions. Only interactive widgets (calendar, cart) hydrate on the client.

### Image optimization

Next.js `<Image>` component for automatic resizing, format conversion (WebP/AVIF), and lazy loading. Product and room images served from R2/Uploadthing with CDN caching.

### Database performance

- Connection pooling via Supabase's built-in pgBouncer connection pooling.
- Composite indexes on availability queries (room + date + time, instructor + date + time).
- Partial indexes for active records (published products, non-cancelled bookings).
- Paginated queries with cursor-based pagination for admin lists.

### Caching

- Edge caching for public pages via Vercel's ISR (Incremental Static Regeneration) with revalidation.
- `unstable_cache` or `revalidateTag` for frequently accessed data (categories, settings).
- No external cache layer (Redis) for MVP. Add when latency or load requires it.

### Client performance

- Lazy loading for heavy components (admin data tables, rich text editors) via `next/dynamic`.
- Route-based code splitting (automatic via App Router).
- Optimistic UI updates for cart operations.

---

## Data Flow: Booking

Simplified flow for the core booking use case:

```
1. Customer browses catalog (Server Component, cached)
2. Customer selects product -> product detail page (Server Component)
3. Customer picks date -> availability check
   - slot-generator reads schedules for product
   - Checks blocked_dates for room/instructor
   - Checks existing bookings for conflicts
   - Returns available time slots
4. Customer selects slot -> adds to cart (Client Component, Server Action)
5. Customer checks out -> creates order + booking(s) in transaction
   - Validate slot still available (SELECT FOR UPDATE on bookings)
   - Insert order, order_items, bookings
   - Create payment via gateway adapter
   - Return payment URL/instructions
6. Customer pays -> gateway webhook fires
   - Verify webhook signature
   - Update payment status
   - Update order status to 'paid'
   - Update booking status to 'confirmed'
   - Send confirmation notification (email/WhatsApp)
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Payment - Midtrans
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
MIDTRANS_IS_PRODUCTION=false

# Email
RESEND_API_KEY=...

# Storage
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Migration Strategy

Drizzle Kit generates SQL migrations from schema changes:

```bash
npx drizzle-kit generate    # Generate migration from schema diff
npx drizzle-kit migrate     # Apply pending migrations
npx drizzle-kit studio      # Visual DB browser (development)
```

Migrations are committed to version control. Applied automatically on deployment via a build step or standalone migrate script.
