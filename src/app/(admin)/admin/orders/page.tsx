import { revalidatePath } from "next/cache"
import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { orders, users, bookings, orderItems } from "@/lib/db/schema"
import { desc, eq, inArray } from "drizzle-orm"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { SectionLabel, StatusBadge } from "@/components/editorial"
import { CheckCircle, XCircle, FileText } from "lucide-react"

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
        <SectionLabel number="01" label="LOG TRANSAKSI" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">
          Daftar Pesanan & Transaksi
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Semua pesanan masuk, rincian item, dan status pembayaran pelanggan.
        </p>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
        {orderList.length === 0 ? (
          <p className="p-8 text-center font-mono text-xs text-[#6f6f6a]">Belum ada transaksi pesanan yang masuk.</p>
        ) : (
          orderList.map((o) => (
            <div key={o.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-2 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#f3f1eb]">{o.orderNumber}</span>
                  <StatusBadge status={o.status} />
                </div>

                <p className="text-xs text-[#6f6f6a]">
                  Pemesan: <strong className="text-[#f3f1eb] font-medium">{o.customerName}</strong> ({o.customerEmail}) · Dibuat: {formatDate(o.createdAt)}
                </p>

                {o.items.length > 0 && (
                  <div className="text-xs text-[#e8e6df] bg-[#0a0a0a] p-2.5 border border-[#f3f1eb]/[0.08] space-y-1">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>• {it.description} ({it.quantity}x)</span>
                        <span className="text-[#6f6f6a] font-mono">{formatRupiah(it.total)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="font-bold text-base text-[#f3f1eb]">Total: {formatRupiah(o.total)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/account/orders/${o.id}/invoice`} target="_blank">
                  <Button variant="outline" size="sm" className="h-8 font-mono text-xs border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#6f6f6a]" />
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
                        className="h-8 font-mono text-[10px] uppercase tracking-wider bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none flex items-center gap-1.5 font-medium"
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
                        className="h-8 font-mono text-[10px] uppercase text-[#e88] hover:text-[#fff] hover:bg-[#1f0d0d] rounded-none flex items-center gap-1"
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
