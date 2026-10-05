import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { handlePaymentWebhook } from "@/lib/modules/payment/payment.service"

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get("orderNumber")

  if (orderNumber) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
    })

    if (order) {
      await handlePaymentWebhook({
        order_id: orderNumber,
        transaction_status: "settlement",
        status_code: "200",
        gross_amount: String(order.total),
        signature_key: "mock",
      }).catch((err) => console.error("[mock-redirect]", err))
    }
  }

  return NextResponse.redirect(new URL("/account/orders", req.url))
}
