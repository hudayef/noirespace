import { NextRequest, NextResponse } from "next/server"
import { handlePaymentWebhook } from "@/lib/modules/payment/payment.service"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    await handlePaymentWebhook(payload)
    return NextResponse.json({ status: "OK" }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook processing error"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
