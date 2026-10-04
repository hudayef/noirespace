import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/modules/auth"
import { getOrCreateCart, addItemToCart, getCartWithItems, removeCartItem } from "@/lib/modules/commerce/cart.service"

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

    if (!productId || price === undefined) {
      return NextResponse.json({ error: "Data produk tidak lengkap" }, { status: 400 })
    }

    const cart = await getOrCreateCart(session.user.id)

    const item = await addItemToCart({
      cartId: cart.id,
      productId,
      bookingDate,
      startTime,
      endTime,
      quantity,
      price,
      options,
    })

    return NextResponse.json({ success: true, item }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menambahkan ke keranjang" }, { status: 500 })
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
    await removeCartItem(itemId)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Gagal menghapus item" }, { status: 500 })
  }
}
