import { db } from "@/lib/db"
import { bookings, bookingReschedules, products, schedules, orders } from "@/lib/db/schema"
import { eq, and, desc, gte, sql, ne } from "drizzle-orm"
import { validateBookingSlot } from "./conflict"
import { canReschedule, canCancelBooking } from "./policy"

export async function getUserBookings(customerId: string) {
  return db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      bookingDate: bookings.bookingDate,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      participants: bookings.participants,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      productName: products.name,
      productType: products.type,
    })
    .from(bookings)
    .innerJoin(products, eq(bookings.productId, products.id))
    .where(eq(bookings.customerId, customerId))
    .orderBy(desc(bookings.bookingDate))
}

export async function getUpcomingBookings(customerId: string) {
  const today = new Date().toISOString().split("T")[0]

  return db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      bookingDate: bookings.bookingDate,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      participants: bookings.participants,
      status: bookings.status,
      productName: products.name,
      productType: products.type,
    })
    .from(bookings)
    .innerJoin(products, eq(bookings.productId, products.id))
    .where(
      and(
        eq(bookings.customerId, customerId),
        gte(bookings.bookingDate, today),
        eq(bookings.status, "confirmed")
      )
    )
    .orderBy(bookings.bookingDate)
}

export async function getBookingById(id: string) {
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, id),
  })

  if (!booking) return null

  const product = await db.query.products.findFirst({
    where: eq(products.id, booking.productId),
  })

  const reschedules = await db.query.bookingReschedules.findMany({
    where: eq(bookingReschedules.bookingId, id),
  })

  return {
    ...booking,
    product,
    reschedules,
  }
}

export async function rescheduleBooking(params: {
  bookingId: string
  newDate: string
  newStartTime: string
  newEndTime: string
  reason?: string
  userId: string
}) {
  const { bookingId, newDate, newStartTime, newEndTime, reason, userId } = params

  return db.transaction(async (tx) => {
    const booking = await tx.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
    })

    if (!booking) {
      throw new Error("Booking tidak ditemukan")
    }

    if (booking.customerId !== userId) {
      throw new Error("Tidak memiliki izin untuk booking ini")
    }

    const existingReschedules = await tx.query.bookingReschedules.findMany({
      where: eq(bookingReschedules.bookingId, bookingId),
    })

    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}+07:00`)
    const check = canReschedule({
      status: booking.status,
      bookingDateTime,
      rescheduleCount: existingReschedules.length,
      now: new Date(),
    })

    if (!check.allowed) {
      throw new Error(check.reason || "Pengajuan reschedule tidak memenuhi syarat")
    }

    // Acquire transaction lock on target product and target date
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${booking.productId} || '_' || ${newDate}))`)

    const newDayOfWeek = new Date(`${newDate}T00:00:00+07:00`).getDay()
    const targetSchedule = await tx.query.schedules.findFirst({
      where: and(
        eq(schedules.productId, booking.productId),
        eq(schedules.status, "active"),
        eq(schedules.dayOfWeek, newDayOfWeek)
      ),
    })

    const targetRoomId = booking.roomId || targetSchedule?.roomId || null
    const targetInstructorId = booking.instructorId || targetSchedule?.instructorId || null

    const validation = await validateBookingSlot({
      productId: booking.productId,
      bookingDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      participants: booking.participants,
      roomId: targetRoomId,
      instructorId: targetInstructorId,
      excludeBookingId: booking.id,
      client: tx,
    })

    if (!validation.valid) {
      throw new Error(validation.error || "Slot waktu baru tidak tersedia")
    }

    await tx.insert(bookingReschedules).values({
      bookingId: booking.id,
      originalDate: booking.bookingDate,
      originalStartTime: booking.startTime,
      originalEndTime: booking.endTime,
      newDate,
      newStartTime,
      newEndTime,
      reason: reason || null,
      requestedBy: userId,
      status: "approved",
    })

    const [updated] = await tx
      .update(bookings)
      .set({
        bookingDate: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        roomId: targetRoomId,
        instructorId: targetInstructorId,
        scheduleId: targetSchedule?.id || booking.scheduleId,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning()

    return updated
  })
}

export async function cancelBookingPrePayment(bookingId: string, userId: string, reason?: string) {
  return db.transaction(async (tx) => {
    const booking = await tx.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
    })

    if (!booking) {
      throw new Error("Booking tidak ditemukan")
    }

    if (booking.customerId !== userId) {
      throw new Error("Tidak memiliki izin untuk membatalkan booking ini")
    }

    if (!canCancelBooking(booking.status)) {
      throw new Error("Pembatalan hanya diperbolehkan sebelum pembayaran diselesaikan")
    }

    const [cancelled] = await tx
      .update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: userId,
        cancellationReason: reason || "Dibatalkan oleh pelanggan",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning()

    // If this booking belongs to an order, check if any active bookings remain
    if (booking.orderId) {
      const remainingActiveBookings = await tx.query.bookings.findMany({
        where: and(
          eq(bookings.orderId, booking.orderId),
          ne(bookings.status, "cancelled")
        ),
      })

      if (remainingActiveBookings.length === 0) {
        await tx
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(and(eq(orders.id, booking.orderId), eq(orders.status, "pending")))
      }
    }

    return cancelled
  })
}
