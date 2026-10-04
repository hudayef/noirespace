import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { orders, users, bookings } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function AdminOrdersPage() {
  await requireAdmin()

  const orderList = await db
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

  async function handleMarkPaid(formData: FormData) {
    "use server"
    const orderId = formData.get("orderId") as string
    if (!orderId) return

    await db.update(orders).set({ status: "paid", updatedAt: new Date() }).where(eq(orders.id, orderId))
    await db.update(bookings).set({ status: "confirmed", updatedAt: new Date() }).where(eq(bookings.orderId, orderId))
    revalidatePath("/admin/orders")
    revalidatePath("/admin/bookings")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pesanan (Orders)</h1>
        <p className="text-muted-foreground text-sm">Daftar seluruh invoice transaksi pesanan dari pelanggan.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card">
        {orderList.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada pesanan masuk.</p>
        ) : (
          orderList.map((o) => (
            <div key={o.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold">{o.orderNumber}</span>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pemesan: <strong>{o.customerName}</strong> ({o.customerEmail}) | Tanggal: {formatDate(o.createdAt)}
                </p>
                <p className="font-bold text-base">{formatRupiah(o.total)}</p>
              </div>

              {o.status !== "paid" && (
                <form action={handleMarkPaid}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <Button type="submit" size="sm" className="text-xs">
                    Tandai Telah Dibayar
                  </Button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
