import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { rescheduleBooking } from "@/lib/modules/booking/booking.service"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { bookingId, newDate, newStartTime, newEndTime, reason } = body

    if (!bookingId || !newDate || !newStartTime || !newEndTime) {
      return NextResponse.json({ error: "Data reschedule tidak lengkap" }, { status: 400 })
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(newDate))) {
      return NextResponse.json({ error: "Format tanggal tidak valid (YYYY-MM-DD)" }, { status: 400 })
    }

    const timeRe = /^\d{2}:\d{2}(:\d{2})?$/
    if (!timeRe.test(String(newStartTime)) || !timeRe.test(String(newEndTime))) {
      return NextResponse.json({ error: "Format jam tidak valid (HH:mm)" }, { status: 400 })
    }

    const updated = await rescheduleBooking({
      bookingId: String(bookingId),
      newDate: String(newDate),
      newStartTime: String(newStartTime),
      newEndTime: String(newEndTime),
      reason: reason ? String(reason).slice(0, 500) : undefined,
      userId: session.user.id,
    })

    return NextResponse.json({ success: true, booking: updated })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses reschedule"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

