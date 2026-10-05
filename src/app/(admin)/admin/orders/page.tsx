import { revalidatePath } from "next/cache"
import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { orders, users, bookings, orderItems } from "@/lib/db/schema"
import { desc, eq, inArray } from "drizzle-orm"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { ShoppingCart, CheckCircle, XCircle, FileText } from "lucide-react"

export default async function AdminOrdersPage() {
  await requireAdmin()

  const rawOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      subtotal: orders.subtotal,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(orders)
    .innerJoin(users, eq(orders.customerId, users.id))
    .orderBy(desc(orders.createdAt))

  const orderIds = rawOrders.map((o) => o.id)
  const allItems = orderIds.length > 0
    ? await db.query.orderItems.findMany({
        where: inArray(orderItems.orderId, orderIds),
      })
    : []

  const orderList = rawOrders.map((o) => ({
    ...o,
    items: allItems.filter((it) => it.orderId === o.id),
  }))

  async function handleMarkPaid(formData: FormData) {
    "use server"
    await requireAdmin()
    const orderId = formData.get("orderId") as string
    if (!orderId) return

    await db.update(orders).set({ status: "paid", updatedAt: new Date() }).where(eq(orders.id, orderId))
    await db.update(bookings).set({ status: "confirmed", updatedAt: new Date() }).where(eq(bookings.orderId, orderId))
    revalidatePath("/admin/orders")
    revalidatePath("/admin/bookings")
  }

  async function handleCancelOrder(formData: FormData) {
    "use server"
    await requireAdmin()
    const orderId = formData.get("orderId") as string
    if (!orderId) return

    await db.update(orders).set({ status: "cancelled", updatedAt: new Date() }).where(eq(orders.id, orderId))
    await db.update(bookings).set({
      status: "cancelled",
      cancellationReason: "Dibatalkan oleh Admin",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(bookings.orderId, orderId))

    revalidatePath("/admin/orders")
    revalidatePath("/admin/bookings")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <ShoppingCart className="h-6 w-6 text-amber-400" />
          <span>Daftar Pesanan & Transaksi</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Semua pesanan masuk, rincian item, dan status pembayaran pelanggan.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {orderList.length === 0 ? (
          <p className="p-8 text-center text-xs text-neutral-400">Belum ada transaksi pesanan yang masuk.</p>
        ) : (
          orderList.map((o) => (
            <div key={o.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white">{o.orderNumber}</span>
                  <span
                    className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                      o.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : o.status === "cancelled"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-400">
                  Pemesan: <strong className="text-white">{o.customerName}</strong> ({o.customerEmail}) • Dibuat: {formatDate(o.createdAt)}
                </p>

                {o.items.length > 0 && (
                  <div className="text-xs text-neutral-300 bg-black/30 rounded-md p-2.5 border border-white/[0.04] space-y-1">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>• {it.description} ({it.quantity}x)</span>
                        <span className="text-neutral-400 font-mono">{formatRupiah(it.total)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="font-extrabold text-base text-amber-300">Total: {formatRupiah(o.total)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/account/orders/${o.id}/invoice`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs border-white/[0.12] text-neutral-300 hover:text-white flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>Faktur</span>
                  </Button>
                </Link>

                {o.status !== "paid" && o.status !== "cancelled" && (
                  <>
                    <form action={handleMarkPaid}>
                      <input type="hidden" name="orderId" value={o.id} />
                      <Button
                        type="submit"
                        size="sm"
                        className="text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Tandai Lunas</span>
                      </Button>
                    </form>

                    <form action={handleCancelOrder}>
                      <input type="hidden" name="orderId" value={o.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Batalkan</span>
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
