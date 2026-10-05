import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { getOrCreateCart, addItemToCart, getCartWithItems, removeCartItem } from "@/lib/modules/commerce/cart.service"
import { validateBookingSlot } from "@/lib/modules/booking/conflict"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu" }, { status: 401 })
  }

  try {
    const data = await getCartWithItems(session.user.id)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data keranjang" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu untuk melanjutkan booking" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { productId, bookingDate, startTime, endTime, quantity = 1, price, options } = body

    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "Data produk tidak lengkap" }, { status: 400 })
    }

    const parsedQuantity = Number(quantity)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 50) {
      return NextResponse.json({ error: "Jumlah pesanan tidak valid" }, { status: 400 })
    }

    const timeRe = /^\d{2}:\d{2}(:\d{2})?$/
    if (bookingDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(bookingDate))) {
      return NextResponse.json({ error: "Format tanggal tidak valid" }, { status: 400 })
    }
    if ((startTime && !timeRe.test(String(startTime))) || (endTime && !timeRe.test(String(endTime)))) {
      return NextResponse.json({ error: "Format waktu tidak valid" }, { status: 400 })
    }

    const cart = await getOrCreateCart(session.user.id)

    if (bookingDate && startTime && endTime) {
      const validation = await validateBookingSlot({
        productId,
        bookingDate,
        startTime,
        endTime,
        participants: parsedQuantity,
        excludeCartId: cart.id,
      })

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error || "Slot waktu tidak tersedia" }, { status: 400 })
      }
    }

    const item = await addItemToCart({
      cartId: cart.id,
      productId,
      bookingDate,
      startTime,
      endTime,
      quantity: parsedQuantity,
      price,
      options,
    })

    return NextResponse.json({ success: true, item }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menambahkan ke keranjang"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")

  if (!itemId) {
    return NextResponse.json({ error: "ID item wajib diisi" }, { status: 400 })
  }

  try {
    await removeCartItem(itemId, session.user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Gagal menghapus item" }, { status: 500 })
  }
}
