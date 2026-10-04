import { db } from "@/lib/db"
import { bookings, products } from "@/lib/db/schema"
import { eq, and, ne } from "drizzle-orm"

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + m
}

export async function validateBookingSlot(params: {
  productId: string
  bookingDate: string
  startTime: string
  endTime: string
  participants?: number
  roomId?: string | null
  instructorId?: string | null
  excludeBookingId?: string
}): Promise<{ valid: boolean; error?: string }> {
  const {
    productId,
    bookingDate,
    startTime,
    endTime,
    participants = 1,
    roomId,
    instructorId,
    excludeBookingId,
  } = params

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    return { valid: false, error: "Produk tidak ditemukan" }
  }

  const reqStart = parseTimeToMinutes(startTime)
  const reqEnd = parseTimeToMinutes(endTime)

  if (reqStart >= reqEnd) {
    return { valid: false, error: "Waktu mulai harus lebih awal dari waktu selesai" }
  }

  const existingBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.bookingDate, bookingDate),
      ne(bookings.status, "cancelled")
    ),
  })

  const overlapping = existingBookings.filter((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false
    const bStart = parseTimeToMinutes(b.startTime)
    const bEnd = parseTimeToMinutes(b.endTime)
    return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd)
  })

  if (roomId) {
    const roomBusy = overlapping.some((b) => b.roomId === roomId)
    if (roomBusy) {
      return { valid: false, error: "Ruangan sudah terisi pada slot waktu tersebut" }
    }
  }

  if (instructorId) {
    const instructorBusy = overlapping.some((b) => b.instructorId === instructorId)
    if (instructorBusy) {
      return { valid: false, error: "Instruktur memiliki sesi lain pada slot waktu tersebut" }
    }
  }

  const productBookings = overlapping.filter((b) => b.productId === productId)
  const currentTotal = productBookings.reduce((sum, b) => sum + (b.participants || 1), 0)
  const maxCap = product.capacity || 1

  if (currentTotal + participants > maxCap) {
    return { valid: false, error: "Kapasitas kuota untuk slot waktu ini sudah penuh" }
  }

  return { valid: true }
}
