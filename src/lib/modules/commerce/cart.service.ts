import { db } from "@/lib/db"
import { carts, cartItems, products } from "@/lib/db/schema"
import { eq, and, gt } from "drizzle-orm"

export async function getOrCreateCart(customerId: string) {
  const existing = await db.query.carts.findFirst({
    where: and(
      eq(carts.customerId, customerId),
      gt(carts.expiresAt, new Date())
    ),
  })

  if (existing) {
    return existing
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  const [created] = await db
    .insert(carts)
    .values({
      customerId,
      expiresAt,
    })
    .returning()

  return created
}

export async function addItemToCart(params: {
  cartId: string
  productId: string
  bookingDate?: string
  startTime?: string
  endTime?: string
  quantity?: number
  price?: number
  options?: Record<string, unknown>
}) {
  const { cartId, productId, bookingDate, startTime, endTime, quantity = 1, options = {} } = params

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product || product.status !== "published") {
    throw new Error("Produk tidak ditemukan atau tidak aktif")
  }

  const safeQuantity = Math.max(1, Math.min(50, Math.floor(quantity)))
  const safePrice = product.price

  // Hold timer: refresh cart expiration on every item addition (15 minutes hold window)
  await db.update(carts).set({ expiresAt: new Date(Date.now() + 15 * 60 * 1000) }).where(eq(carts.id, cartId))

  const [item] = await db
    .insert(cartItems)
    .values({
      cartId,
      productId,
      bookingDate,
      startTime,
      endTime,
      quantity: safeQuantity,
      price: safePrice,
      options,
    })
    .returning()

  return item
}

export async function getCartWithItems(customerId: string) {
  const cart = await getOrCreateCart(customerId)

  const items = await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      bookingDate: cartItems.bookingDate,
      startTime: cartItems.startTime,
      endTime: cartItems.endTime,
      quantity: cartItems.quantity,
      price: products.price,
      options: cartItems.options,
      productName: products.name,
      productType: products.type,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id))

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    cart,
    items,
    subtotal,
  }
}

export async function removeCartItem(itemId: string, customerId: string) {
  const userCart = await db.query.carts.findFirst({
    where: eq(carts.customerId, customerId),
  })
  if (!userCart) return

  await db.delete(cartItems).where(
    and(
      eq(cartItems.id, itemId),
      eq(cartItems.cartId, userCart.id)
    )
  )
}

export async function clearCart(cartId: string) {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
}

