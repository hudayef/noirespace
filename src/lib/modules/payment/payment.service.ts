import { db } from "@/lib/db"
import { payments, paymentLogs, orders, bookings, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { MidtransAdapter } from "./gateways/midtrans"
import type { PaymentAdapter } from "./payment.types"
import { getOrderById } from "@/lib/modules/commerce/order.service"
import { sendNotification } from "@/lib/modules/notification/notification.service"

const adapter: PaymentAdapter = new MidtransAdapter()

export async function createPaymentForOrder(orderId: string, requesterId?: string) {
  const order = await getOrderById(orderId)
  if (!order) throw new Error("Pesanan tidak ditemukan")

  if (requesterId && order.customerId !== requesterId) {
    throw new Error("Anda tidak memiliki izin untuk membayar pesanan ini")
  }

  if (order.status === "paid") {
    return {
      redirectUrl: `/checkout/confirmation/${order.id}`,
    }
  }

  if (order.status === "cancelled") {
    throw new Error("Pesanan ini telah dibatalkan dan tidak dapat dibayar")
  }

  const existingPayment = await db.query.payments.findFirst({
    where: and(
      eq(payments.orderId, order.id),
      eq(payments.status, "waiting")
    ),
  })

  if (existingPayment?.gatewayResponse && existingPayment.expiredAt && existingPayment.expiredAt.getTime() > Date.now()) {
    const raw = existingPayment.gatewayResponse as Record<string, unknown> | null
    if (typeof raw?.redirect_url === "string") {
      return {
        payment: existingPayment,
        redirectUrl: raw.redirect_url,
      }
    }
  }

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

  // 1. Amount verification (anti-tampering)
  if (payload.gross_amount !== undefined) {
    const paidAmount = Math.round(Number(payload.gross_amount))
    if (!Number.isNaN(paidAmount) && paidAmount !== order.total) {
      throw new Error(`Payment amount mismatch: expected ${order.total}, got ${paidAmount}`)
    }
  }

  // 2. Idempotency & State Protection
  if (order.status === "paid") {
    if (verification.transactionStatus === "paid") {
      return { success: true, message: "Order already paid" }
    }
    return { success: true, message: "Order already settled; status unchanged" }
  }

  const existingPayment = await db.query.payments.findFirst({
    where: eq(payments.orderId, order.id),
  })

  await db.transaction(async (tx) => {
    if (existingPayment) {
      await tx
        .update(payments)
        .set({
          status: verification.transactionStatus,
          paidAt: verification.transactionStatus === "paid" ? new Date() : existingPayment.paidAt,
          gatewayResponse: verification.rawPayload,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, existingPayment.id))

      await tx.insert(paymentLogs).values({
        paymentId: existingPayment.id,
        event: `webhook_${verification.transactionStatus}`,
        data: verification.rawPayload,
      })
    }

    if (verification.transactionStatus === "paid") {
      await tx
        .update(orders)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(orders.id, order.id))

      await tx
        .update(bookings)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(
          and(
            eq(bookings.orderId, order.id),
            eq(bookings.status, "pending")
          )
        )
    } else if (["failed", "expired"].includes(verification.transactionStatus)) {
      await tx
        .update(orders)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(orders.id, order.id))

      await tx
        .update(bookings)
        .set({
          status: "cancelled",
          cancellationReason: `Pembayaran ${verification.transactionStatus}`,
          cancelledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(bookings.orderId, order.id),
            eq(bookings.status, "pending")
          )
        )
    }
  })

  if (verification.transactionStatus === "paid") {
    const customer = await db.query.users.findFirst({
      where: eq(users.id, order.customerId),
    })

    if (customer) {
      await sendNotification({
        userId: customer.id,
        type: "payment_received",
        title: "Pembayaran Dikonfirmasi — Noire Space",
        body: `Pembayaran untuk pesanan ${order.orderNumber} telah berhasil diterima. Jadwal sesi Anda telah terkonfirmasi.`,
        data: {
          recipientEmail: customer.email,
          phone: customer.phone,
          orderNumber: order.orderNumber,
          amount: order.total,
        },
      })
    }
  }

  return { success: true }
}
