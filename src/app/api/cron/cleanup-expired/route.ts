import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, bookings, payments, carts } from "@/lib/db/schema"
import { eq, and, lt, or, inArray } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.get("authorization")
  const isVercelCron = req.headers.get("x-vercel-cron") === "1"

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === "production" && !isVercelCron) {
    return NextResponse.json({ error: "CRON_SECRET is required in production" }, { status: 403 })
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  try {
    const expiredOrders = await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(
        and(
          or(eq(orders.status, "awaiting_payment"), eq(orders.status, "pending")),
          lt(orders.createdAt, cutoff)
        )
      )
      .returning()

    const expiredOrderIds = expiredOrders.map((o) => o.id)

    if (expiredOrderIds.length > 0) {
      await db
        .update(bookings)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: "Pembayaran kedaluwarsa (24 jam)",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(bookings.status, "pending"),
            inArray(bookings.orderId, expiredOrderIds)
          )
        )
    }

    await db
      .update(payments)
      .set({ status: "expired", updatedAt: new Date() })
      .where(and(eq(payments.status, "waiting"), lt(payments.createdAt, cutoff)))

    const clearedCarts = await db
      .delete(carts)
      .where(lt(carts.expiresAt, cutoff))
      .returning()

    return NextResponse.json({
      success: true,
      cancelledOrders: expiredOrders.length,
      clearedCarts: clearedCarts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("[CRON cleanup error]:", err)
    return NextResponse.json({ error: "Gagal memproses pembersihan otomatis" }, { status: 500 })
  }
}
