import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { createOrderFromCart } from "@/lib/modules/commerce/order.service"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 500) : undefined
    const order = await createOrderFromCart(session.user.id, notes)
    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses pesanan"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
