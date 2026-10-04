# 08 - Security

Security architecture and practices for Noire Space. Defense in depth across all layers.

---

## Authentication

### Email + Password

- Registration requires email, password, and name
- Password stored as bcrypt hash (cost factor 10+)
- Plain text passwords never logged, stored, or transmitted beyond the initial HTTPS request
- Password minimum 8 characters, enforced server-side via Zod schema

### Session Management

- Auth.js (NextAuth.js v5) handles session lifecycle
- Sessions stored as JWT in HTTP-only, Secure, SameSite=Lax cookies
- Session token contains user ID, email, role, and permissions
- Token expiry: 30 days (configurable)
- Refresh rotation: enabled
- No session data exposed to client JavaScript

### Future: OAuth

- Google OAuth provider prepared in Auth.js config
- No additional password required for OAuth users
- Account linking by email (same email = same account)

---

## Authorization (RBAC)

### Role Hierarchy

| Role | Access Level |
|------|-------------|
| super_admin | Full system access, manage other admins |
| admin | Manage products, bookings, orders, schedules, customers |
| staff | View bookings, check-in customers, limited operational access |
| customer | Own bookings, own orders, own profile |

### Enforcement

- Middleware checks role on every route in `(admin)` and `(customer)` route groups
- Server Actions validate role before executing mutations
- API routes validate role before processing requests
- Database queries scoped to authorized data (customers only see own records)
- Role check utility: `requireRole(session, ['admin', 'super_admin'])`
- Unauthorized access returns 403 with generic message, no details

### Route Protection

```
(admin)/*     -> requires admin or super_admin role
(customer)/*  -> requires authenticated user (any role)
(public)/*    -> no authentication required
api/webhooks  -> signature verification (no session required)
```

---

## Input Validation

### Zod Schemas

- Every form submission and API input validated with Zod schemas
- Schemas defined once, shared between client (form validation) and server (action/route validation)
- Server-side validation is authoritative; client-side is UX convenience only
- Schema validates types, formats, ranges, and business constraints

### Validation Rules

- Email: valid format, lowercase, trimmed
- Phone: Indonesian format validation
- Dates: valid ISO format, within business rules (booking window)
- Prices: positive integers (IDR, no decimals)
- Slugs: lowercase alphanumeric with hyphens
- IDs: valid UUID format
- Text fields: max length enforced, trimmed
- Enums: strict allowlist (status values, roles, product types)

### File Uploads

- Allowed MIME types: image/jpeg, image/png, image/webp
- Max file size: 5MB per image
- Files uploaded to external storage (R2/Uploadthing), not local filesystem
- Filename sanitized before storage

---

## CSRF Protection

- Next.js App Router with Server Actions has built-in CSRF protection
- SameSite=Lax cookies prevent cross-origin request forgery
- Server Actions verify the request origin header
- API routes that accept mutations use POST/PUT/DELETE (never GET for state changes)
- Webhook endpoints exempt from CSRF (use signature verification instead)

---

## Rate Limiting

### Login Attempts

- Maximum 5 failed login attempts per email per 15-minute window
- After limit reached: 15-minute lockout with generic error message
- No indication of whether the email exists (same error for wrong email and wrong password)

### API Rate Limits

- Public API: 60 requests per minute per IP
- Authenticated API: 120 requests per minute per user
- Webhook endpoints: no rate limit (verified by signature)
- Rate limit headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Implementation

- In-memory rate limiting for MVP (sufficient for single-instance Vercel deployment)
- Upgrade to Redis-based rate limiting if multi-region deployment is needed

---

## Payment Security

### Webhook Verification

- All payment webhooks verified using gateway-provided signature
- Midtrans: SHA-512 signature verification using server key
- Xendit: callback token verification
- Invalid signatures rejected with 401, logged for investigation
- Webhook endpoint is idempotent (duplicate notifications handled gracefully)

### Data Handling

- No credit card numbers stored in the system
- No card data passes through the server (redirect/iframe-based payment)
- Payment gateway handles PCI DSS compliance
- Only payment reference ID, status, amount, and gateway response metadata stored
- Gateway credentials stored in environment variables, never in code or database

### HTTPS Only

- All payment-related communication over HTTPS
- Webhook callback URLs use HTTPS
- Payment redirect URLs use HTTPS

---

## Data Protection

### Password Hashing

- bcrypt with cost factor 10 minimum
- Passwords never stored in plain text
- Password not included in any API response or log output
- Password comparison done server-side only

### PII Handling

- Customer PII (name, email, phone, address): stored in database, access controlled by RBAC
- PII not included in application logs
- PII not exposed in URLs or query parameters
- Admin can view customer data; customers can view only their own data
- No PII in error messages returned to client

### Data at Rest

- Database encryption handled by hosting provider (Neon/Supabase)
- Backups encrypted by provider

### Data in Transit

- All traffic over HTTPS (TLS 1.2+)
- Vercel enforces HTTPS by default
- HSTS header enabled

---

## Audit Logging

### What is Logged

| Event | Data Captured |
|-------|--------------|
| Login success/failure | User email, IP, timestamp, user agent |
| Role change | Who changed, target user, old role, new role |
| Order creation | Order ID, customer, items, total |
| Payment status change | Order ID, payment ID, old status, new status |
| Booking status change | Booking ID, old status, new status, changed by |
| Product create/update/delete | Product ID, changed by, changed fields |
| Schedule create/update/delete | Schedule ID, changed by |
| Admin actions | Action type, target entity, performed by |

### Storage

- Audit logs stored in dedicated `audit_logs` table
- Logs are append-only (no update or delete)
- Log retention: indefinite for MVP (review post-launch)
- Admin can view audit logs in admin dashboard

### Format

Each audit log entry contains:
- `id`: UUID
- `action`: string (e.g., `booking.status_changed`)
- `entity_type`: string (e.g., `booking`, `order`, `product`)
- `entity_id`: UUID
- `actor_id`: UUID (user who performed the action)
- `actor_role`: string
- `metadata`: JSONB (old values, new values, context)
- `ip_address`: string
- `created_at`: timestamp

---

## SQL Injection Prevention

- Drizzle ORM uses parameterized queries for all database operations
- No raw SQL string concatenation
- When raw SQL is needed (complex queries), use Drizzle's `sql` template literal which auto-parameterizes
- User input never interpolated directly into query strings

---

## XSS Prevention

### React Auto-Escaping

- React automatically escapes all values rendered in JSX
- No use of `dangerouslySetInnerHTML` unless absolutely necessary (and with sanitized input)
- User-generated content (names, descriptions) always rendered as text nodes

### Content Security Policy

CSP headers configured to restrict script sources:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  connect-src 'self' https:;
  frame-src 'self' https://*.midtrans.com https://*.xendit.co;
  font-src 'self';
```

Note: `unsafe-inline` and `unsafe-eval` for scripts are required by Next.js in development. Production CSP should be tightened with nonce-based approach when feasible.

---

## Secure Headers

Configured via `next.config.js` headers or middleware:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused APIs |
| `X-DNS-Prefetch-Control` | `off` | Prevent DNS prefetching |

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `AUTH_SECRET` | Auth.js session encryption key | Random 32+ char string |
| `AUTH_URL` | Application URL for auth callbacks | `https://noirespace.com` |
| `MIDTRANS_SERVER_KEY` | Payment gateway server key | `SB-Mid-server-...` |
| `MIDTRANS_CLIENT_KEY` | Payment gateway client key | `SB-Mid-client-...` |
| `RESEND_API_KEY` | Email service API key | `re_...` |
| `STORAGE_ACCESS_KEY` | File storage credentials | Varies by provider |

### Rules

- Never commit `.env` files to version control
- `.env.example` contains variable names without values
- Production secrets managed via Vercel environment variables UI
- Different values for development, staging, and production
- Rotate keys if a breach is suspected
- Minimum privilege: each key has only the permissions it needs

---

## Error Handling

### Client-Facing Errors

- Generic error messages returned to client: "Something went wrong" or specific business errors ("Slot no longer available")
- No stack traces in production responses
- No database error details in responses
- No internal IDs or system information in error messages
- HTTP status codes used correctly (400, 401, 403, 404, 500)

### Server-Side Errors

- Full error details logged server-side with context (request ID, user ID, endpoint)
- Unhandled exceptions caught by global error handler
- Error tracking via Sentry (optional, recommended for production)
- Error boundaries in React for graceful client-side failure

### Error Response Format

```json
{
  "error": {
    "message": "The selected time slot is no longer available.",
    "code": "SLOT_UNAVAILABLE"
  }
}
```

No `stack`, `query`, `internal` fields in production responses.

---

## Security Checklist (Pre-Launch)

- [ ] All environment variables set in production
- [ ] HTTPS enforced on all endpoints
- [ ] Secure headers configured and verified
- [ ] Rate limiting active on login and public API
- [ ] Payment webhook signatures verified
- [ ] No PII in logs
- [ ] No secrets in code or version control
- [ ] RBAC tested for all role combinations
- [ ] Input validation on all mutations
- [ ] Error responses reviewed for information leakage
- [ ] CSP headers configured
- [ ] Database backups verified
- [ ] Audit logging active
- [ ] Dependency audit (`npm audit`) clean
