import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { payments, orders } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatRupiah, formatDate } from "@/lib/utils/format"

export default async function AdminPaymentsPage() {
  await requireAdmin()

  const paymentList = await db
    .select({
      id: payments.id,
      paymentNumber: payments.paymentNumber,
      amount: payments.amount,
      gateway: payments.gateway,
      status: payments.status,
      paidAt: payments.paidAt,
      createdAt: payments.createdAt,
      orderNumber: orders.orderNumber,
    })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .orderBy(desc(payments.createdAt))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Log Transaksi Pembayaran</h1>
        <p className="text-muted-foreground text-sm">Riwayat interaksi transaksi payment gateway Midtrans.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card">
        {paymentList.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada riwayat transaksi pembayaran.</p>
        ) : (
          paymentList.map((p) => (
            <div key={p.id} className="p-4 flex justify-between items-center text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{p.paymentNumber}</span>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded border bg-muted">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Order: {p.orderNumber} | Gateway: {p.gateway} | Dibuat: {formatDate(p.createdAt)}
                </p>
                <p className="font-bold">{formatRupiah(p.amount)}</p>
              </div>

              <div className="text-right text-xs text-muted-foreground">
                {p.paidAt ? `Dibayar: ${formatDate(p.paidAt)}` : "Belum Lunas"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
