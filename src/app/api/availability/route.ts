import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/modules/booking/availability"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("productId")
  const date = searchParams.get("date")

  if (!productId || !date) {
    return NextResponse.json({ error: "Parameter productId dan date wajib diisi" }, { status: 400 })
  }

  try {
    const slots = await getAvailableSlots(productId, date)
    return NextResponse.json({ slots })
  } catch {
    return NextResponse.json({ error: "Gagal mengambil ketersediaan jadwal" }, { status: 500 })
  }
}
