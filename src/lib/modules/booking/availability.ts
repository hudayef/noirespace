import { db } from "@/lib/db"
import { products, bookings, blockedDates, businessHours, schedules, cartItems, carts } from "@/lib/db/schema"
import { eq, and, ne, gt } from "drizzle-orm"

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
  remainingCapacity: number
  totalCapacity: number
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + m
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
}

export async function getAvailableSlots(productId: string, dateStr: string): Promise<TimeSlot[]> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product || product.status !== "published") {
    return []
  }

  const targetDateWIB = new Date(`${dateStr}T00:00:00+07:00`)
  const now = new Date()

  const diffHours = (targetDateWIB.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (diffHours < (product.minBookingNoticeHours || 0) - 24) {
    return []
  }

  const maxAdvanceMs = (product.maxAdvanceBookingDays || 30) * 24 * 60 * 60 * 1000
  if (targetDateWIB.getTime() - now.getTime() > maxAdvanceMs) {
    return []
  }

  const blocked = await db.query.blockedDates.findFirst({
    where: eq(blockedDates.date, dateStr),
  })
  if (blocked && !blocked.startTime) {
    return []
  }

  const dayOfWeek = targetDateWIB.getDay()

  const bHours = await db.query.businessHours.findFirst({
    where: eq(businessHours.dayOfWeek, dayOfWeek),
  })

  if (bHours?.isClosed || (dayOfWeek === 0 && !bHours)) {
    return []
  }

  const openMinutes = bHours ? parseTimeToMinutes(bHours.openTime) : 9 * 60
  const closeMinutes = bHours ? parseTimeToMinutes(bHours.closeTime) : 18 * 60

  const productSchedules = await db.query.schedules.findMany({
    where: and(
      eq(schedules.productId, productId),
      eq(schedules.status, "active"),
      eq(schedules.dayOfWeek, dayOfWeek)
    ),
  })

  const duration = product.durationMinutes || 60
  const buffer = product.bufferMinutes || 15
  const step = duration + buffer
  const maxCap = product.capacity || 1

  const candidateSlots: { start: number; end: number }[] = []

  if (productSchedules.length > 0) {
    for (const s of productSchedules) {
      candidateSlots.push({
        start: parseTimeToMinutes(s.startTime),
        end: parseTimeToMinutes(s.endTime),
      })
    }
  } else {
    let cursor = openMinutes
    while (cursor + duration <= closeMinutes) {
      candidateSlots.push({
        start: cursor,
        end: cursor + duration,
      })
      cursor += step
    }
  }

  const allBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.productId, productId),
      eq(bookings.bookingDate, dateStr),
      ne(bookings.status, "cancelled")
    ),
  })

  const cutoffPendingTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const activeBookings = allBookings.filter((b) => {
    if (b.status === "pending" && b.createdAt < cutoffPendingTime) {
      return false
    }
    return true
  })

  const heldCartItems = await db
    .select({
      startTime: cartItems.startTime,
      endTime: cartItems.endTime,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(carts, eq(cartItems.cartId, carts.id))
    .where(
      and(
        eq(cartItems.productId, productId),
        eq(cartItems.bookingDate, dateStr),
        gt(carts.expiresAt, now)
      )
    )

  const results: TimeSlot[] = []

  for (const slot of candidateSlots) {
    const startStr = formatMinutesToTime(slot.start)
    const endStr = formatMinutesToTime(slot.end)

    const overlappingBookings = activeBookings.filter((b) => {
      const bStart = parseTimeToMinutes(b.startTime)
      const bEnd = parseTimeToMinutes(b.endTime)
      return Math.max(slot.start, bStart) < Math.min(slot.end, bEnd)
    })

    const overlappingCartItems = heldCartItems.filter((item) => {
      if (!item.startTime || !item.endTime) return false
      const cStart = parseTimeToMinutes(item.startTime)
      const cEnd = parseTimeToMinutes(item.endTime)
      return Math.max(slot.start, cStart) < Math.min(slot.end, cEnd)
    })

    const bookedCount = overlappingBookings.reduce((acc, curr) => acc + (curr.participants || 1), 0)
    const heldCount = overlappingCartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)
    const totalOccupied = bookedCount + heldCount
    const remaining = Math.max(0, maxCap - totalOccupied)
    const isAvailable = remaining > 0

    results.push({
      startTime: startStr,
      endTime: endStr,
      available: isAvailable,
      remainingCapacity: remaining,
      totalCapacity: maxCap,
    })
  }

  return results
}
