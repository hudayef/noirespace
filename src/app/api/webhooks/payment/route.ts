import { NextRequest, NextResponse } from "next/server"
import { handlePaymentWebhook } from "@/lib/modules/payment/payment.service"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    await handlePaymentWebhook(payload)
    return NextResponse.json({ status: "OK" }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 400 })
  }
}
