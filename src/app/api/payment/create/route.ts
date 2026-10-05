import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { createPaymentForOrder } from "@/lib/modules/payment/payment.service"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.json({ error: "Parameter orderId wajib disertakan" }, { status: 400 })
  }

  try {
    const { redirectUrl } = await createPaymentForOrder(orderId, session.user.id)
    return NextResponse.redirect(new URL(redirectUrl, req.url))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal membuat transaksi pembayaran"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
