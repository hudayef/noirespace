import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { users, userRoles, roles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { registerSchema } from "@/lib/validators/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, email, phone, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    })

    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const passwordHash = await hash(password, 10)

    const [user] = await db.insert(users).values({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash,
    }).returning()

    const customerRole = await db.query.roles.findFirst({
      where: eq(roles.slug, "customer"),
    })

    if (customerRole) {
      await db.insert(userRoles).values({
        userId: user.id,
        roleId: customerRole.id,
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
