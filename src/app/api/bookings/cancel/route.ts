import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { cancelBookingPrePayment } from "@/lib/modules/booking/booking.service"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { bookingId, reason } = body

    if (!bookingId) {
      return NextResponse.json({ error: "ID booking wajib disertakan" }, { status: 400 })
    }

    const cancelled = await cancelBookingPrePayment(bookingId, session.user.id, reason)
    return NextResponse.json({ success: true, booking: cancelled })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal membatalkan booking" }, { status: 400 })
  }
}
