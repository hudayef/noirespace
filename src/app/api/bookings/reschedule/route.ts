import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { rescheduleBooking } from "@/lib/modules/booking/booking.service"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { bookingId, newDate, newStartTime, newEndTime, reason } = body

    if (!bookingId || !newDate || !newStartTime || !newEndTime) {
      return NextResponse.json({ error: "Data reschedule tidak lengkap" }, { status: 400 })
    }

    const updated = await rescheduleBooking({
      bookingId,
      newDate,
      newStartTime,
      newEndTime,
      reason,
      userId: session.user.id,
    })

    return NextResponse.json({ success: true, booking: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memproses reschedule" }, { status: 400 })
  }
}
