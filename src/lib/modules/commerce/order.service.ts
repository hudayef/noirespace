import { db } from "@/lib/db"
import { orders, orderItems, bookings, users, schedules, products } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import { getCartWithItems, clearCart } from "./cart.service"
import { validateBookingSlot } from "@/lib/modules/booking/conflict"
import { generateOrderNumber, generateBookingNumber } from "@/lib/utils/id"
import { sendNotification } from "@/lib/modules/notification/notification.service"

export async function createOrderFromCart(customerId: string, notes?: string) {
  const { cart, items } = await getCartWithItems(customerId)

  if (items.length === 0) {
    throw new Error("Keranjang belanja kosong")
  }

  if (cart.expiresAt && cart.expiresAt.getTime() < Date.now()) {
    throw new Error("Masa penahanan slot keranjang Anda telah berakhir (15 menit). Silakan pilih ulang jadwal sesi.")
  }

  const orderNumber = generateOrderNumber()

  return db.transaction(async (tx) => {
    // 1. Concurrency control: acquire advisory lock and validate each slot
    for (const item of items) {
      if (item.bookingDate && item.startTime && item.endTime) {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${item.productId} || '_' || ${item.bookingDate}))`)

        const itemDayOfWeek = new Date(`${item.bookingDate}T00:00:00+07:00`).getDay()
        const schedule = await tx.query.schedules.findFirst({
          where: and(
            eq(schedules.productId, item.productId),
            eq(schedules.status, "active"),
            eq(schedules.dayOfWeek, itemDayOfWeek)
          ),
        })

        const validation = await validateBookingSlot({
          productId: item.productId,
          bookingDate: item.bookingDate,
          startTime: item.startTime,
          endTime: item.endTime,
          participants: item.quantity,
          roomId: schedule?.roomId,
          instructorId: schedule?.instructorId,
          excludeCartId: cart.id,
          client: tx,
        })

        if (!validation.valid) {
          throw new Error(`Slot tidak tersedia untuk ${item.productName}: ${validation.error}`)
        }
      }
    }

    // 2. Fetch canonical prices from products table to prevent price manipulation
    let calculatedSubtotal = 0
    const verifiedItems = []

    for (const item of items) {
      const product = await tx.query.products.findFirst({
        where: eq(products.id, item.productId),
      })
      if (!product || product.status !== "published") {
        throw new Error(`Layanan ${item.productName} sedang tidak tersedia`)
      }
      const unitPrice = product.price
      const itemTotal = unitPrice * item.quantity
      calculatedSubtotal += itemTotal
      verifiedItems.push({
        ...item,
        unitPrice,
        itemTotal,
      })
    }

    const [createdOrder] = await tx
      .insert(orders)
      .values({
        orderNumber,
        customerId,
        subtotal: calculatedSubtotal,
        total: calculatedSubtotal,
        status: "pending",
        notes: notes ? String(notes).slice(0, 500) : null,
      })
      .returning()

    for (const item of verifiedItems) {
      let bookingId: string | undefined

      if (item.bookingDate && item.startTime && item.endTime) {
        const itemDayOfWeek = new Date(`${item.bookingDate}T00:00:00+07:00`).getDay()
        const schedule = await tx.query.schedules.findFirst({
          where: and(
            eq(schedules.productId, item.productId),
            eq(schedules.status, "active"),
            eq(schedules.dayOfWeek, itemDayOfWeek)
          ),
        })

        const bookingNumber = generateBookingNumber()
        const [b] = await tx
          .insert(bookings)
          .values({
            bookingNumber,
            customerId,
            orderId: createdOrder.id,
            productId: item.productId,
            scheduleId: schedule?.id || null,
            roomId: schedule?.roomId || null,
            instructorId: schedule?.instructorId || null,
            bookingDate: item.bookingDate,
            startTime: item.startTime,
            endTime: item.endTime,
            participants: item.quantity,
            status: "pending",
          })
          .returning()
        bookingId = b.id
      }

      await tx.insert(orderItems).values({
        orderId: createdOrder.id,
        productId: item.productId,
        bookingId: bookingId || null,
        description: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.itemTotal,
        options: item.options || {},
      })
    }

    await clearCart(cart.id)

    const customer = await db.query.users.findFirst({
      where: eq(users.id, customerId),
    })

    sendNotification({
      userId: customerId,
      type: "order_created",
      title: "Pesanan Dibuat — Menunggu Pembayaran",
      body: `Pesanan Anda #${orderNumber} telah dibuat. Silakan selesaikan pembayaran dalam 24 jam untuk mengonfirmasi jadwal booking.`,
      data: {
        recipientEmail: customer?.email,
        phone: customer?.phone,
        orderNumber,
        total: calculatedSubtotal,
      },
    }).catch(() => {})

    return createdOrder
  })
}

export async function getOrderById(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })

  if (!order) return null

  const items = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, order.id),
  })

  const orderBookings = await db.query.bookings.findMany({
    where: eq(bookings.orderId, order.id),
  })

  return {
    ...order,
    items,
    bookings: orderBookings,
  }
}

export async function getUserOrders(customerId: string) {
  return db.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    orderBy: [desc(orders.createdAt)],
  })
}
