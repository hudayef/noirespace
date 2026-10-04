# 10 - Deployment

Deployment architecture and operations for Noire Space.

---

## Infrastructure

| Component | Provider | Plan |
|-----------|----------|------|
| Application | Vercel | Pro (or Hobby for initial MVP) |
| Database | Neon PostgreSQL | Free tier -> Pro |
| Email | Resend | Free tier (100 emails/day) |
| File Storage | Cloudflare R2 or Uploadthing | Free tier |
| Domain | Custom domain on Vercel | noirespace.com |
| DNS | Vercel (or Cloudflare) | Included |
| Error Tracking | Sentry (optional) | Free tier |
| Analytics | Vercel Analytics | Included with Pro |

---

## Vercel Deployment

### Configuration

- Framework: Next.js (auto-detected)
- Build command: `next build`
- Output directory: `.next`
- Install command: `npm ci`
- Node.js version: 20.x
- Region: Singapore (`sin1`) — closest to Indonesia

### Preview Deployments

- Every push to a non-main branch creates a preview deployment
- Preview deployments use the staging database (Neon branch)
- Preview URL format: `noirespace-<hash>.vercel.app`

### Production Deployment

- Push to `main` branch triggers production deployment
- Production URL: `noirespace.com`
- Zero-downtime deployment (Vercel handles rollout)
- Instant rollback via Vercel dashboard if needed

---

## Database

### Neon PostgreSQL

- Serverless PostgreSQL with connection pooling
- Auto-suspend on inactivity (free tier)
- Branching for preview environments

### Environments

| Environment | Database | Branch |
|-------------|----------|--------|
| Development | Local PostgreSQL or Neon dev branch | `dev` |
| Staging | Neon branch | `staging` |
| Production | Neon main | `main` |

### Migrations

Drizzle Kit handles schema migrations:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# Push schema directly (development only)
npx drizzle-kit push

# View database in Drizzle Studio
npx drizzle-kit studio
```

Migration workflow:
1. Modify schema in `src/db/schema/`
2. Run `drizzle-kit generate` to create migration SQL
3. Review generated SQL in `drizzle/` directory
4. Commit migration files
5. Migration applied during deployment (CI step or manual)

### Backup Strategy

- Neon provides point-in-time recovery (PITR) on Pro plan
- Daily logical backups via `pg_dump` (automated via cron or GitHub Action)
- Backup retention: 7 days minimum
- Test restore procedure monthly

---

## Environment Variables

### Required (All Environments)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DATABASE_URL_DIRECT` | Direct connection (for migrations) |
| `AUTH_SECRET` | Auth.js encryption key |
| `AUTH_URL` | Application base URL |
| `MIDTRANS_SERVER_KEY` | Payment gateway server key |
| `MIDTRANS_CLIENT_KEY` | Payment gateway client key |
| `MIDTRANS_IS_PRODUCTION` | `true` or `false` |
| `RESEND_API_KEY` | Email service key |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |

### Optional

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | Error tracking endpoint |
| `STORAGE_ACCESS_KEY` | File storage credentials |
| `STORAGE_SECRET_KEY` | File storage secret |
| `STORAGE_BUCKET` | File storage bucket name |

### Management

- Development: `.env.local` (git-ignored)
- Staging/Production: Vercel Environment Variables UI
- `.env.example` committed to repo with variable names (no values)
- Sensitive variables marked as "Sensitive" in Vercel (encrypted, hidden in logs)

---

## CI/CD Pipeline

### GitHub Actions

Workflow file: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx vitest run

  e2e-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && github.base_ref == 'main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test

  deploy:
    needs: [lint-and-typecheck, unit-tests]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
```

### Pipeline Steps

| Step | Trigger | Required to Pass |
|------|---------|-----------------|
| Lint | Every push, every PR | Yes |
| Type check | Every push, every PR | Yes |
| Unit tests | Every push, every PR | Yes |
| E2E tests | PR to main only | Yes |
| Deploy to production | Push to main | After lint + typecheck + unit tests pass |

### Branch Strategy

| Branch | Purpose | Deploys To |
|--------|---------|-----------|
| `main` | Production-ready code | Production |
| `develop` | Integration branch | Preview (staging) |
| `feature/*` | Feature development | Preview |
| `fix/*` | Bug fixes | Preview |

---

## Staging Environment

- Separate Vercel project or Vercel preview on `develop` branch
- Separate Neon database branch
- Staging payment gateway (Midtrans sandbox)
- Staging email (Resend test mode or Mailtrap)
- URL: `staging.noirespace.com` or Vercel preview URL
- Used for UAT before production releases

---

## Monitoring

### Vercel Analytics

- Web Vitals (LCP, FID, CLS, TTFB)
- Page views and unique visitors
- Function invocation count and duration
- Error rates

### Error Tracking (Sentry)

- Capture unhandled exceptions in both server and client
- Source maps uploaded during build for readable stack traces
- Alert on new errors or error rate spikes
- Environment tags: `production`, `staging`, `development`

### Health Check

- `/api/health` endpoint returns `200 OK` with database connectivity status
- Uptime monitoring via external service (UptimeRobot, Vercel built-in)
- Alert on downtime via email or Slack

### Logging

- Vercel function logs (stdout/stderr)
- Structured JSON logging for production
- Log levels: `error`, `warn`, `info`, `debug`
- No PII in logs (see `08-security.md`)

---

## Domain and SSL

### Domain Setup

1. Register `noirespace.com` (if not already registered)
2. Add domain in Vercel project settings
3. Update DNS records (A record and CNAME) to point to Vercel
4. Vercel provisions SSL certificate automatically (Let's Encrypt)
5. HTTPS enforced; HTTP redirects to HTTPS

### DNS Records

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` (Vercel) |
| CNAME | www | `cname.vercel-dns.com` |

### Subdomains

| Subdomain | Purpose |
|-----------|---------|
| `noirespace.com` | Production |
| `www.noirespace.com` | Redirect to apex |
| `staging.noirespace.com` | Staging (optional) |

---

## Deployment Checklist

### First Production Deployment

- [ ] Vercel project created and linked to GitHub repo
- [ ] Custom domain configured with SSL
- [ ] All production environment variables set
- [ ] Production database created and migrated
- [ ] Seed data loaded (categories, admin user, operating hours)
- [ ] Payment gateway production credentials configured
- [ ] Payment webhook URL registered with gateway
- [ ] Email service verified (sender domain)
- [ ] Secure headers verified (`curl -I https://noirespace.com`)
- [ ] Health check endpoint responding
- [ ] Error tracking configured (Sentry DSN set)
- [ ] Uptime monitoring configured
- [ ] Database backup schedule confirmed

### Every Deployment

- [ ] CI pipeline passes (lint, typecheck, tests)
- [ ] Database migrations reviewed and applied
- [ ] Environment variables added/updated if needed
- [ ] Smoke test critical flows after deploy
- [ ] Monitor error rates for 30 minutes post-deploy
