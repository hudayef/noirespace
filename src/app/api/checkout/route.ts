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
    const order = await createOrderFromCart(session.user.id, body.notes)
    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memproses pesanan" }, { status: 400 })
  }
}
