import { db } from "@/lib/db"
import { bookings, products, cartItems, carts } from "@/lib/db/schema"
import { eq, and, ne, gt } from "drizzle-orm"

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + m
}

type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]

interface BookingRecord {
  id: string
  productId: string
  bookingDate: string
  startTime: string
  endTime: string
  participants: number | null
  roomId: string | null
  instructorId: string | null
  status: string
  createdAt: Date
}

interface CartHoldItem {
  cartId: string
  quantity: number
  startTime: string | null
  endTime: string | null
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
  excludeCartId?: string
  client?: DbClient
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
    excludeCartId,
    client = db,
  } = params

  const product = await client.query.products.findFirst({
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

  const existingBookings = (await client.query.bookings.findMany({
    where: and(
      eq(bookings.bookingDate, bookingDate),
      ne(bookings.status, "cancelled")
    ),
  })) as BookingRecord[]

  const cutoffPendingTime = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const overlapping = existingBookings.filter((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false
    if (b.status === "pending" && b.createdAt && b.createdAt < cutoffPendingTime) return false
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
  const currentTotal = productBookings.reduce((sum: number, b) => sum + (b.participants || 1), 0)
  const maxCap = product.capacity || 1

  // Check active cart holds if excludeCartId is passed or by default
  let heldParticipants = 0
  try {
    const now = new Date()
    const activeCartHolds = (await client
      .select({
        cartId: cartItems.cartId,
        quantity: cartItems.quantity,
        startTime: cartItems.startTime,
        endTime: cartItems.endTime,
      })
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .where(
        and(
          eq(cartItems.productId, productId),
          eq(cartItems.bookingDate, bookingDate),
          gt(carts.expiresAt, now),
          excludeCartId ? ne(carts.id, excludeCartId) : undefined
        )
      )) as CartHoldItem[]

    heldParticipants = activeCartHolds
      .filter((c) => {
        if (!c.startTime || !c.endTime) return false
        const cStart = parseTimeToMinutes(c.startTime)
        const cEnd = parseTimeToMinutes(c.endTime)
        return Math.max(reqStart, cStart) < Math.min(reqEnd, cEnd)
      })
      .reduce((sum: number, c) => sum + (c.quantity || 1), 0)
  } catch {
    // If cart relation query fails in transaction context, fallback to booking checks
  }

  if (currentTotal + heldParticipants + participants > maxCap) {
    return { valid: false, error: "Kapasitas kuota untuk slot waktu ini sudah penuh atau sedang ditahan pemesan lain" }
  }

  return { valid: true }
}

