import { db } from "@/lib/db"
import { bookings, bookingReschedules, products } from "@/lib/db/schema"
import { eq, and, desc, gte } from "drizzle-orm"
import { validateBookingSlot } from "./conflict"

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

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  })

  if (!booking) {
    throw new Error("Booking tidak ditemukan")
  }

  if (booking.customerId !== userId) {
    throw new Error("Tidak memiliki izin untuk booking ini")
  }

  if (booking.status !== "confirmed") {
    throw new Error("Hanya booking yang telah dikonfirmasi yang dapat di-reschedule")
  }

  const existingReschedules = await db.query.bookingReschedules.findMany({
    where: eq(bookingReschedules.bookingId, bookingId),
  })

  if (existingReschedules.length >= 1) {
    throw new Error("Batas reschedule telah tercapai (maksimal 1 kali)")
  }

  const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}`)
  const diffHours = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60)

  if (diffHours < 24) {
    throw new Error("Reschedule hanya dapat dilakukan maksimal 24 jam sebelum jadwal")
  }

  const validation = await validateBookingSlot({
    productId: booking.productId,
    bookingDate: newDate,
    startTime: newStartTime,
    endTime: newEndTime,
    participants: booking.participants,
    roomId: booking.roomId,
    instructorId: booking.instructorId,
    excludeBookingId: booking.id,
  })

  if (!validation.valid) {
    throw new Error(validation.error || "Slot waktu baru tidak tersedia")
  }

  await db.insert(bookingReschedules).values({
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

  const [updated] = await db
    .update(bookings)
    .set({
      bookingDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId))
    .returning()

  return updated
}

export async function cancelBookingPrePayment(bookingId: string, userId: string, reason?: string) {
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  })

  if (!booking) {
    throw new Error("Booking tidak ditemukan")
  }

  if (booking.customerId !== userId) {
    throw new Error("Tidak memiliki izin untuk membatalkan booking ini")
  }

  if (booking.status !== "pending") {
    throw new Error("Pembatalan hanya diperbolehkan sebelum pembayaran diselesaikan")
  }

  const [cancelled] = await db
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

  return cancelled
}
