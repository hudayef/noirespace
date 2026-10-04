# 09 - Testing Strategy

Testing approach for Noire Space. Focus on business-critical paths first. No 100% coverage target; test what matters.

---

## Tools

| Tool | Purpose | Scope |
|------|---------|-------|
| Vitest | Unit tests, integration tests | Business logic, API routes, DB operations |
| Playwright | End-to-end tests | Critical user flows in browser |
| Testing Library | Component rendering | React component tests (via Vitest) |

---

## Test Priority

What to test first, in order of business criticality:

1. **Availability engine** — Core logic. Incorrect availability = double bookings or lost revenue.
2. **Double booking prevention** — Must be impossible under concurrent requests.
3. **Payment flow** — Webhook handling, status transitions, order updates.
4. **Booking status transitions** — Only valid transitions allowed.
5. **Order status transitions** — Only valid transitions allowed.
6. **RBAC enforcement** — Admin routes blocked for customers, customer data scoped.
7. **Cart hold / slot reservation** — Expiry releases slots correctly.
8. **Reschedule logic** — Validates 24h rule, max attempts, new slot availability.

---

## Unit Tests

### Scope

Pure business logic functions. No database, no HTTP, no external services. Fast, deterministic.

### What to Test

**Availability Engine** (`lib/availability/`)

- Given operating hours, existing bookings, and buffer time, return correct available slots
- Respect room capacity constraints
- Respect instructor availability
- Respect resource quantity limits
- Blocked dates produce zero slots
- Edge cases: booking at start/end of operating hours, back-to-back bookings with buffer

**Pricing** (`lib/pricing/`)

- Calculate order total with tax
- Calculate discount (fixed and percentage)
- Discount applied before tax
- Zero tax products
- Multiple line items

**Booking Validation** (`lib/booking/`)

- Valid status transitions accepted
- Invalid status transitions rejected
- Reschedule allowed within 24h window
- Reschedule blocked after max attempts
- Cancellation blocked after payment

**Date/Time Utilities** (`lib/utils/`)

- Time slot generation from operating hours
- Overlap detection between two time ranges
- Buffer time addition
- Timezone handling (Asia/Jakarta)

### Conventions

```
src/
  lib/
    availability/
      engine.ts
      engine.test.ts        <- co-located test file
    pricing/
      calculator.ts
      calculator.test.ts
```

- Test files co-located with source files, named `*.test.ts`
- Use `describe` blocks grouped by function
- Use `it` with descriptive names: `it('returns no slots when all rooms are booked')`
- Use factory functions for test data, not raw object literals everywhere

### Example Structure

```typescript
describe('calculateAvailableSlots', () => {
  it('returns all slots when no existing bookings', () => { ... })
  it('excludes slots that overlap with existing bookings', () => { ... })
  it('applies buffer time between bookings', () => { ... })
  it('returns empty array when room is fully booked', () => { ... })
  it('respects instructor availability', () => { ... })
  it('returns empty array on blocked dates', () => { ... })
  it('handles multiple rooms with different availability', () => { ... })
})
```

---

## Integration Tests

### Scope

API routes and server actions that interact with the database. Uses a test database (Neon branch or local PostgreSQL via Docker).

### What to Test

**API Routes**

- `POST /api/bookings` — creates booking, validates availability, prevents double booking
- `POST /api/orders` — creates order with items, calculates totals
- `POST /api/webhooks/payment` — processes payment webhook, updates order and booking status
- `GET /api/availability` — returns correct slots for product + date
- CRUD routes for products, schedules, rooms, instructors (admin)

**Database Operations**

- Booking creation with concurrent requests (race condition test)
- Transaction rollback on partial failure
- Cascade behavior (delete product -> impact on bookings)
- Unique constraint enforcement (double booking at DB level)

**Auth**

- Login with valid credentials returns session
- Login with invalid credentials returns error
- Protected routes return 401 without session
- Admin routes return 403 for customer role

### Test Database Setup

```
1. Create a test database (Neon branch or local PostgreSQL)
2. Run migrations: `drizzle-kit push`
3. Seed with test data before each test suite
4. Truncate tables after each test suite
```

Environment variable: `DATABASE_URL_TEST` points to test database.

### Concurrency Test Pattern

```typescript
it('prevents double booking under concurrent requests', async () => {
  const slot = { date: '2025-03-15', time: '10:00', roomId: 'room-1' }

  const [result1, result2] = await Promise.all([
    createBooking({ ...slot, customerId: 'customer-1' }),
    createBooking({ ...slot, customerId: 'customer-2' }),
  ])

  const succeeded = [result1, result2].filter(r => r.success)
  const failed = [result1, result2].filter(r => !r.success)

  expect(succeeded).toHaveLength(1)
  expect(failed).toHaveLength(1)
  expect(failed[0].error).toBe('SLOT_UNAVAILABLE')
})
```

---

## E2E Tests

### Scope

Full user flows in a real browser. Test the complete stack from UI interaction to database state.

### What to Test

**Critical Flows (must have)**

1. **Booking flow**: Browse catalog -> select product -> pick time slot -> add to cart -> checkout -> order created
2. **Payment flow**: Order created -> redirect to payment -> webhook received -> order confirmed -> booking confirmed
3. **Admin product CRUD**: Create product -> appears in catalog -> edit product -> changes reflected -> archive product -> hidden from catalog
4. **Admin booking management**: View bookings -> change status -> status updated
5. **Customer dashboard**: Login -> view upcoming bookings -> view booking history

**Secondary Flows (should have)**

6. **Reschedule**: Customer reschedules a booking -> new slot assigned -> old slot released
7. **Cancellation**: Customer cancels unpaid order -> slots released
8. **School inquiry**: Submit inquiry form -> appears in admin -> status progression

### Conventions

```
e2e/
  booking-flow.spec.ts
  payment-flow.spec.ts
  admin-products.spec.ts
  admin-bookings.spec.ts
  customer-dashboard.spec.ts
```

- E2E tests in top-level `e2e/` directory
- One file per flow
- Use Page Object pattern for shared selectors and actions
- Run against staging environment or local dev server
- Seed test data before test suite, clean up after

### Authentication in E2E

- Use `storageState` to persist login session across tests in a flow
- Create test users via seed data (admin, customer)
- Do not test login flow in every spec; authenticate once and reuse session

---

## Test Data Seeding

### Seed Script

A dedicated seed script (`scripts/seed.ts`) that creates consistent test data:

```
- 1 admin user
- 2 customer users
- 3 product categories
- 6 products (one of each booking type)
- 2 rooms
- 2 instructors
- 3 resources (with quantities)
- Operating hours (Mon-Sat 09:00-18:00)
- 5 existing bookings (for availability testing)
- 2 orders (pending, paid)
```

### Principles

- Seed data is deterministic (same data every run)
- Use fixed UUIDs for seed entities (easier to reference in tests)
- Seed script is idempotent (can run multiple times safely with upsert)
- Separate seed data from production data (test database only)

---

## Running Tests

```bash
# Unit tests
npx vitest run

# Unit tests (watch mode)
npx vitest

# Integration tests
DATABASE_URL_TEST=... npx vitest run --project integration

# E2E tests
npx playwright test

# E2E tests (headed, for debugging)
npx playwright test --headed

# All tests
npm test
```

### CI Configuration

Tests run in GitHub Actions on every push and PR:

```yaml
- Unit tests: always run, must pass
- Integration tests: run if src/ changed, must pass
- E2E tests: run on PR to main, must pass
```

See `10-deployment.md` for full CI/CD pipeline details.

---

## What NOT to Test

- UI styling and layout (visual regression is out of scope for MVP)
- Third-party library internals (Drizzle, Auth.js, shadcn/ui)
- Static pages with no logic (about, FAQ, contact)
- Admin settings forms (simple CRUD, tested via integration tests on API)
- Email delivery (mock the email service, verify the function was called with correct params)
