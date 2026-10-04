import { db } from "@/lib/db"
import { orders, orderItems, bookings } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getCartWithItems, clearCart } from "./cart.service"
import { validateBookingSlot } from "@/lib/modules/booking/conflict"
import { generateOrderNumber, generateBookingNumber } from "@/lib/utils/id"

export async function createOrderFromCart(customerId: string, notes?: string) {
  const { cart, items, subtotal } = await getCartWithItems(customerId)

  if (items.length === 0) {
    throw new Error("Keranjang belanja kosong")
  }

  for (const item of items) {
    if (item.bookingDate && item.startTime && item.endTime) {
      const validation = await validateBookingSlot({
        productId: item.productId,
        bookingDate: item.bookingDate,
        startTime: item.startTime,
        endTime: item.endTime,
        participants: item.quantity,
      })

      if (!validation.valid) {
        throw new Error(`Slot tidak tersedia untuk ${item.productName}: ${validation.error}`)
      }
    }
  }

  const orderNumber = generateOrderNumber()

  const [createdOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerId,
      subtotal,
      total: subtotal,
      status: "pending",
      notes,
    })
    .returning()

  for (const item of items) {
    let bookingId: string | undefined

    if (item.bookingDate && item.startTime && item.endTime) {
      const bookingNumber = generateBookingNumber()
      const [b] = await db
        .insert(bookings)
        .values({
          bookingNumber,
          customerId,
          orderId: createdOrder.id,
          productId: item.productId,
          bookingDate: item.bookingDate,
          startTime: item.startTime,
          endTime: item.endTime,
          participants: item.quantity,
          status: "pending",
        })
        .returning()
      bookingId = b.id
    }

    await db.insert(orderItems).values({
      orderId: createdOrder.id,
      productId: item.productId,
      bookingId: bookingId || null,
      description: item.productName,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
      options: item.options || {},
    })
  }

  await clearCart(cart.id)

  return createdOrder
}

export async function getOrderById(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })

  if (!order) return null

  const items = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, order.id),
  })

  return {
    ...order,
    items,
  }
}

export async function getUserOrders(customerId: string) {
  return db.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    orderBy: [desc(orders.createdAt)],
  })
}
