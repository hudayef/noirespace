import { NextRequest, NextResponse } from "next/server"
import { handlePaymentWebhook } from "@/lib/modules/payment/payment.service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get("orderNumber")

  if (orderNumber) {
    await handlePaymentWebhook({
      order_id: orderNumber,
      transaction_status: "settlement",
      status_code: "200",
      gross_amount: "100000",
      signature_key: "mock",
    }).catch(() => {})
  }

  return NextResponse.redirect(new URL("/account/orders", req.url))
}
