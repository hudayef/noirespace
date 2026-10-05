import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { ShoppingCart, FileText } from "lucide-react"

export default async function CustomerOrdersPage() {
  const user = await requireAuth()
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <ShoppingCart className="h-6 w-6 text-amber-400" />
          <span>Riwayat Pesanan & Transaksi</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Daftar seluruh transaksi pemesanan layanan dan status pembayaran Anda.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-12 text-center space-y-4 bg-[#121217]">
          <p className="text-xs text-neutral-400">Belum ada riwayat transaksi pesanan.</p>
          <div className="flex justify-center gap-3">
            <Link href="/studio">
              <Button size="sm" className="text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
                Pesan Studio
              </Button>
            </Link>
            <Link href="/programs">
              <Button size="sm" variant="outline" className="text-xs uppercase tracking-wider border-white/15 text-neutral-200">
                Program Edukasi
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
          {orders.map((o) => (
            <div key={o.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1.5">
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
                <p className="text-xs text-neutral-400">{formatDate(o.createdAt)}</p>
                <p className="font-extrabold text-base text-amber-300">{formatRupiah(o.total)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/account/orders/${o.id}/invoice`}>
                  <Button variant="outline" size="sm" className="text-xs border-white/[0.12] text-neutral-200 hover:text-white flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>Faktur</span>
                  </Button>
                </Link>

                {["pending", "awaiting_payment"].includes(o.status) ? (
                  <Link href={`/api/payment/create?orderId=${o.id}`}>
                    <Button size="sm" className="text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
                      Bayar Sekarang
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/checkout/confirmation/${o.id}`}>
                    <Button variant="outline" size="sm" className="text-xs border-white/[0.12] text-neutral-300 hover:text-white">
                      Lihat Bukti
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
