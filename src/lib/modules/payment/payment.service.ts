import { db } from "@/lib/db"
import { payments, paymentLogs, orders, bookings, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { MidtransAdapter } from "./gateways/midtrans"
import type { PaymentAdapter } from "./payment.types"
import { getOrderById } from "@/lib/modules/commerce/order.service"

const adapter: PaymentAdapter = new MidtransAdapter()

export async function createPaymentForOrder(orderId: string) {
  const order = await getOrderById(orderId)
  if (!order) throw new Error("Pesanan tidak ditemukan")

  const customer = await db.query.users.findFirst({
    where: eq(users.id, order.customerId),
  })
  if (!customer) throw new Error("Data pelanggan tidak ditemukan")

  const transaction = await adapter.createTransaction({
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: order.total,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
    items: order.items.map((it) => ({
      id: it.productId,
      name: it.description,
      price: it.unitPrice,
      quantity: it.quantity,
    })),
  })

  const [payment] = await db
    .insert(payments)
    .values({
      orderId: order.id,
      paymentNumber: transaction.paymentNumber,
      amount: order.total,
      gateway: "midtrans",
      gatewayReference: transaction.token || null,
      gatewayResponse: transaction.rawResponse,
      status: "waiting",
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .returning()

  await db
    .update(orders)
    .set({ status: "awaiting_payment", updatedAt: new Date() })
    .where(eq(orders.id, order.id))

  return {
    payment,
    redirectUrl: transaction.redirectUrl,
  }
}

export async function handlePaymentWebhook(payload: Record<string, unknown>) {
  const verification = await adapter.verifyWebhook(payload)

  if (!verification.isValid) {
    throw new Error("Invalid signature key")
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, verification.orderNumber),
  })

  if (!order) {
    throw new Error(`Order ${verification.orderNumber} not found`)
  }

  const existingPayment = await db.query.payments.findFirst({
    where: eq(payments.orderId, order.id),
  })

  if (existingPayment) {
    await db
      .update(payments)
      .set({
        status: verification.transactionStatus,
        paidAt: verification.transactionStatus === "paid" ? new Date() : existingPayment.paidAt,
        gatewayResponse: verification.rawPayload,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, existingPayment.id))

    await db.insert(paymentLogs).values({
      paymentId: existingPayment.id,
      event: `webhook_${verification.transactionStatus}`,
      data: verification.rawPayload,
    })
  }

  if (verification.transactionStatus === "paid") {
    await db
      .update(orders)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(orders.id, order.id))

    await db
      .update(bookings)
      .set({ status: "confirmed", updatedAt: new Date() })
      .where(eq(bookings.orderId, order.id))
  } else if (["failed", "expired"].includes(verification.transactionStatus)) {
    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, order.id))

    await db
      .update(bookings)
      .set({
        status: "cancelled",
        cancellationReason: `Pembayaran ${verification.transactionStatus}`,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.orderId, order.id))
  }

  return { success: true }
}
