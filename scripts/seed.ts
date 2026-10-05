import "dotenv/config"
import { db } from "../src/lib/db"
import {
  roles,
  permissions,
  rolePermissions,
  users,
  userRoles,
  locations,
  rooms,
  resources,
  instructors,
  categories,
  products,
  businessHours,
  settings,
} from "../src/lib/db/schema"
import { hash } from "bcryptjs"
import { eq } from "drizzle-orm"

const ROLES = [
  { name: "Super Admin", slug: "super_admin", description: "Akses penuh" },
  { name: "Admin", slug: "admin", description: "Akses operasional" },
  { name: "Staff", slug: "staff", description: "Akses terbatas" },
  { name: "Customer", slug: "customer", description: "Pelanggan" },
]

const MODULES = [
  "products",
  "categories",
  "rooms",
  "resources",
  "instructors",
  "schedules",
  "bookings",
  "orders",
  "payments",
  "customers",
  "inquiries",
  "reports",
  "settings",
  "audit_log",
]
const ACTIONS = ["create", "read", "update", "delete"]

async function seed() {
  console.log("Seeding roles...")
  const insertedRoles: Record<string, string> = {}
  for (const role of ROLES) {
    const [r] = await db.insert(roles).values(role).onConflictDoNothing().returning()
    if (r) insertedRoles[role.slug] = r.id
    else {
      const existing = await db.query.roles.findFirst({ where: eq(roles.slug, role.slug) })
      if (existing) insertedRoles[role.slug] = existing.id
    }
  }

  console.log("Seeding permissions...")
  const permIds: string[] = []
  for (const mod of MODULES) {
    for (const action of ACTIONS) {
      const slug = `${mod}.${action}`
      const [p] = await db
        .insert(permissions)
        .values({
          name: `${action} ${mod}`,
          slug,
          module: mod,
          description: `${action} ${mod}`,
        })
        .onConflictDoNothing()
        .returning()
      if (p) permIds.push(p.id)
      else {
        const existing = await db.query.permissions.findFirst({ where: eq(permissions.slug, slug) })
        if (existing) permIds.push(existing.id)
      }
    }
  }

  console.log("Assigning permissions to super_admin...")
  for (const permId of permIds) {
    await db
      .insert(rolePermissions)
      .values({
        roleId: insertedRoles["super_admin"],
        permissionId: permId,
      })
      .onConflictDoNothing()
  }

  console.log("Assigning permissions to admin...")
  for (const permId of permIds) {
    await db
      .insert(rolePermissions)
      .values({
        roleId: insertedRoles["admin"],
        permissionId: permId,
      })
      .onConflictDoNothing()
  }

  console.log("Creating super admin user...")
  const passwordHash = await hash("admin123", 10)
  const [admin] = await db
    .insert(users)
    .values({
      name: "Super Admin",
      email: "admin@noirespace.com",
      passwordHash,
      status: "active",
      emailVerifiedAt: new Date(),
    })
    .onConflictDoNothing()
    .returning()

  if (admin) {
    await db
      .insert(userRoles)
      .values({
        userId: admin.id,
        roleId: insertedRoles["super_admin"],
      })
      .onConflictDoNothing()
    console.log("Super admin created: admin@noirespace.com / admin123")
  } else {
    console.log("Super admin already exists")
  }

  console.log("Creating default location...")
  const [location] = await db
    .insert(locations)
    .values({
      name: "Noire Space Creative Hub",
      address: "Jl. Puricitayam Permai, Rawapanjang, Citayam",
      phone: "+62 882-1234-3431",
      email: "noirespace.one@gmail.com",
      timezone: "Asia/Jakarta",
      status: "active",
    })
    .onConflictDoNothing()
    .returning()

  const loc = location || (await db.query.locations.findFirst({ where: eq(locations.name, "Noire Space Creative Hub") }))

  if (loc) {
    console.log("Creating default rooms...")
    const roomData = [
      { name: "Main Studio A", slug: "main-studio-a", capacity: 8 },
      { name: "Content Studio B", slug: "content-studio-b", capacity: 4 },
      { name: "Meeting Room C", slug: "meeting-room-c", capacity: 6 },
    ]
    for (const r of roomData) {
      await db
        .insert(rooms)
        .values({ ...r, locationId: loc.id, description: `Ruangan ${r.name} - fasilitas lengkap`, status: "active", images: [] })
        .onConflictDoNothing()
    }

    console.log("Creating default resources...")
    const resourceData = [
      { name: "Godox SL-60W LED", type: "lighting" as const, quantity: 4 },
      { name: "Aputure Amaran 200d", type: "lighting" as const, quantity: 2 },
      { name: "Sony A7IV + 24-70mm", type: "camera" as const, quantity: 2 },
      { name: "C-Stand + Boom Arm", type: "equipment" as const, quantity: 6 },
      { name: "Softbox Octagon 120cm", type: "lighting" as const, quantity: 3 },
    ]
    for (const res of resourceData) {
      await db
        .insert(resources)
        .values({ ...res, locationId: loc.id, description: res.name, status: "active" })
        .onConflictDoNothing()
    }

    console.log("Creating default instructors...")
    const instructorData = [
      { name: "Alex Pratama", slug: "alex-pratama", bio: "Commercial Photographer & Lighting Specialist" },
      { name: "Rina Wijaya", slug: "rina-wijaya", bio: "Content Creator & Video Editor" },
      { name: "Dimas Satria", slug: "dimas-satria", bio: "AI Creative Tools & Digital Marketing" },
    ]
    for (const inst of instructorData) {
      await db
        .insert(instructors)
        .values({ ...inst, specializations: [], status: "active" })
        .onConflictDoNothing()
    }

    console.log("Creating default categories...")
    const catData = [
      { name: "Studio Rental", slug: "studio-rental", description: "Sewa studio foto dan konten", sortOrder: 1 },
      { name: "Education Programs", slug: "education-programs", description: "Kelas dan workshop teknologi kreatif", sortOrder: 2 },
      { name: "Creative Services", slug: "creative-services", description: "Produksi visual profesional", sortOrder: 3 },
      { name: "School Partnership", slug: "school-partnership", description: "Program B2B untuk institusi pendidikan", sortOrder: 4 },
    ]
    for (const cat of catData) {
      await db.insert(categories).values(cat).onConflictDoNothing()
    }

    console.log("Creating sample products...")
    const studioCat = await db.query.categories.findFirst({ where: eq(categories.slug, "studio-rental") })
    const eduCat = await db.query.categories.findFirst({ where: eq(categories.slug, "education-programs") })
    const svcCat = await db.query.categories.findFirst({ where: eq(categories.slug, "creative-services") })

    const sampleProducts = [
      {
        categoryId: studioCat?.id,
        name: "Studio 30 Menit",
        slug: "studio-30-menit",
        type: "studio" as const,
        price: 75000,
        durationMinutes: 30,
        capacity: 4,
        shortDescription: "Sesi cepat untuk foto produk kecil atau konten singkat",
        status: "published" as const,
        images: [],
        includes: ["Lighting basic", "Background putih/hitam", "Standar assistensi"],
      },
      {
        categoryId: studioCat?.id,
        name: "Studio 60 Menit",
        slug: "studio-60-menit",
        type: "studio" as const,
        price: 150000,
        durationMinutes: 60,
        capacity: 6,
        shortDescription: "Paket standar untuk foto produk, portret, atau konten reels",
        status: "published" as const,
        images: [],
        includes: ["Lighting profesional", "Background multiple", "Full assistensi teknis"],
      },
      {
        categoryId: studioCat?.id,
        name: "Business Content Package",
        slug: "business-content-package",
        type: "studio" as const,
        price: 500000,
        durationMinutes: 180,
        capacity: 1,
        shortDescription: "Paket lengkap foto produk + video reels + editing AI",
        status: "published" as const,
        images: [],
        includes: ["Foto produk 10 SKU", "3 Video Reels 30s", "AI Editing & Color Grade", "Siap publish Instagram/TikTok"],
      },
      {
        categoryId: eduCat?.id,
        name: "Junior Creator",
        slug: "junior-creator",
        type: "education" as const,
        price: 1200000,
        durationMinutes: 480,
        capacity: 15,
        shortDescription: "Program 8 minggu dasar fotografi & konten untuk usia 13-17",
        status: "published" as const,
        images: [],
        includes: ["8 sesi offline", "Akses studio", "Portofolio digital", "Sertifikat"],
      },
      {
        categoryId: eduCat?.id,
        name: "Creator Pro",
        slug: "creator-pro",
        type: "education" as const,
        price: 3500000,
        durationMinutes: 960,
        capacity: 12,
        shortDescription: "Program intensif 12 minggu: foto, video, AI, monetisasi",
        status: "published" as const,
        images: [],
        includes: ["12 sesi offline", "Proyek klien nyata", "Mentoring 1-on-1", "Job placement assistance"],
      },
      {
        categoryId: svcCat?.id,
        name: "Product Photography",
        slug: "product-photography",
        type: "service" as const,
        price: 300000,
        durationMinutes: 120,
        capacity: 1,
        shortDescription: "Jasa foto produk komersial untuk e-commerce",
        status: "published" as const,
        images: [],
        includes: ["Setup lighting", "5 foto per produk", "Background putih/berwarna", "Retouch basic"],
      },
    ]

    for (const prod of sampleProducts) {
      await db.insert(products).values(prod).onConflictDoNothing()
    }

    console.log("Creating business hours...")
    const defaultHours = [
      { dayOfWeek: 1, openTime: "09:00:00", closeTime: "18:00:00", isClosed: false },
      { dayOfWeek: 2, openTime: "09:00:00", closeTime: "18:00:00", isClosed: false },
      { dayOfWeek: 3, openTime: "09:00:00", closeTime: "18:00:00", isClosed: false },
      { dayOfWeek: 4, openTime: "09:00:00", closeTime: "18:00:00", isClosed: false },
      { dayOfWeek: 5, openTime: "09:00:00", closeTime: "18:00:00", isClosed: false },
      { dayOfWeek: 6, openTime: "09:00:00", closeTime: "16:00:00", isClosed: false },
      { dayOfWeek: 0, openTime: "09:00:00", closeTime: "18:00:00", isClosed: true },
    ]
    for (const bh of defaultHours) {
      await db
        .insert(businessHours)
        .values({ locationId: loc.id, ...bh })
        .onConflictDoNothing()
    }

    console.log("Creating default settings...")
    await db
      .insert(settings)
      .values({
        group: "booking",
        key: "min_advance_hours",
        value: 24,
        type: "number",
        description: "Minimal jam booking sebelum sesi",
      })
      .onConflictDoNothing()
    await db
      .insert(settings)
      .values({
        group: "booking",
        key: "max_advance_days",
        value: 30,
        type: "number",
        description: "Maksimal hari ke depan bisa booking",
      })
      .onConflictDoNothing()
    await db
      .insert(settings)
      .values({
        group: "booking",
        key: "buffer_minutes",
        value: 15,
        type: "number",
        description: "Buffer time antar sesi",
      })
      .onConflictDoNothing()
    await db
      .insert(settings)
      .values({
        group: "payment",
        key: "payment_expiry_hours",
        value: 24,
        type: "number",
        description: "Masa berlaku link pembayaran",
      })
      .onConflictDoNothing()
  }

  console.log("Seed complete!")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})