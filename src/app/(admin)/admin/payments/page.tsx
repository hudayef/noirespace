import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { payments, orders } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { CreditCard } from "lucide-react"

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
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <CreditCard className="h-6 w-6 text-amber-400" />
          <span>Log Transaksi Pembayaran</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Riwayat interaksi transaksi payment gateway Midtrans dan status penyelesaiannya.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {paymentList.length === 0 ? (
          <p className="p-8 text-center text-xs text-neutral-400">Belum ada riwayat transaksi pembayaran.</p>
        ) : (
          paymentList.map((p) => (
            <div key={p.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 text-sm">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white">{p.paymentNumber}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      p.status === "paid"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : p.status === "failed" || p.status === "expired"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Pesanan: <span className="font-mono font-bold text-white">#{p.orderNumber}</span> • Gateway: {p.gateway} • Waktu: {formatDate(p.createdAt)}
                </p>
                <p className="font-extrabold text-base text-amber-300">{formatRupiah(p.amount)}</p>
              </div>

              <div className="text-right text-xs">
                {p.paidAt ? (
                  <span className="text-emerald-400 font-medium">Lunas pada: {formatDate(p.paidAt)}</span>
                ) : (
                  <span className="text-neutral-500 italic">Menunggu Pembayaran</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
