# Noire Space — Database Setup (Supabase)

## Langkah 1: Buat Proyek Supabase

1. Buka https://supabase.com
2. Login / sign up
3. Klik **New Project**
4. Isi:
   - **Name**: Noire Space
   - **Database Password**: buat password aman (simpan ini!)
   - **Region**: Singapore (sgp1) — paling dekat dari Indonesia
   - **Postgres Version**: 16
5. Klik **Create New Project**
6. Tunggu ~1-2 menit sampai project ready

## Langkah 2: Ambil Connection String

1. Di dashboard Supabase, klik icon **Settings** (⚙️) di sidebar kiri atas
2. Klik **Database**
3. Di bagian **Connection string**, temukan **Connection string (URI)** — jangan yang "Pooler"
4. Copy URL-nya. Bentuknya seperti:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Langkah 3: Isi Environment Variables

Buat file `.env` di root project ini:

```bash
cp .env.example .env
```

Edit `.env` dan isi `DATABASE_URL` dengan connection string dari Langkah 2:

```
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@db.your-project-ref.supabase.co:5432/postgres
```

Untuk development, Anda bisa generate `AUTH_SECRET`:

```powershell
# PowerShell
openssl rand -base64 32
```

Atau pakai nilai acak yang panjang. Masukkan ke `AUTH_SECRET`.

Opsional (dev mode payment):
- `MIDTRANS_SERVER_KEY=` — biarkan kosong untuk mode mock
- `MIDTRANS_IS_PRODUCTION=false`

## Langkah 4: Jalankan Migrations

```powershell
# Install drizzle-kit globally (sekali saja)
npm install -g drizzle-kit

# Generate migration dari schema
npx drizzle-kit generate

# Apply ke database Supabase
npx drizzle-kit migrate
```

Jika `npx drizzle-kit migrate` gagal karena URL, jalankan lewat script:

```bash
node --loader tsx ./scripts/db-migrate.ts
```

Atau langsung:

```powershell
npx tsx ./scripts/db-migrate.ts
```

## Langkah 5: Seeding Data Dasar

```powershell
npx tsx ./scripts/seed.ts
```

Output yang diharapkan:

```
Seeding roles...
Seeding permissions...
Assigning permissions to super_admin...
Assigning permissions to admin...
Creating super admin user...
Super admin created: admin@noirespace.com / admin123
Creating default location...
Creating default rooms...
Creating default resources...
Creating default instructors...
Creating default categories...
Creating sample products...
Creating business hours...
Creating default settings...
Seed complete!
```

## Verifikasi Database

Buka Supabase SQL Editor dan jalankan:

```sql
SELECT name FROM products;
SELECT name FROM rooms;
SELECT name FROM instructors;
```

Harusnya muncul: Studio 30 Menit, Studio 60 Menit, Business Content Package, Junior Creator, Creator Pro, Product Photography, dll.

## Login ke Aplikasi

Setelah setup, jalankan dev server:

```powershell
npm run dev
```

Buka http://localhost:3000

Login admin:
- Email: `admin@noirespace.com`
- Password: `admin123`

Arahkan ke `/admin` untuk panel admin.
