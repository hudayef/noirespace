import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/editorial"
import { FileText } from "lucide-react"

export default async function CustomerOrdersPage() {
  const user = await requireAuth()
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6a]">02 / TRANSAKSI</span>
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">RIWAYAT PESANAN</h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">Daftar seluruh transaksi pemesanan layanan dan status pembayaran Anda.</p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-[#f3f1eb]/[0.15] p-12 text-center space-y-4 bg-[#111111]">
          <p className="font-mono text-xs text-[#6f6f6a]">Belum ada riwayat transaksi pesanan.</p>
          <div className="flex justify-center gap-3">
            <Link href="/studio">
              <Button size="sm" className="font-mono text-[10px] uppercase tracking-wider font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none">
                Pesan Studio
              </Button>
            </Link>
            <Link href="/programs">
              <Button size="sm" variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] rounded-none">
                Program Edukasi
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
          {orders.map((o) => (
            <div key={o.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#f3f1eb]">{o.orderNumber}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="font-mono text-[11px] text-[#6f6f6a]">{formatDate(o.createdAt)}</p>
                <p className="font-mono font-bold text-base text-[#f3f1eb]">{formatRupiah(o.total)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/account/orders/${o.id}/invoice`}>
                  <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#6f6f6a]" />
                    <span>Faktur</span>
                  </Button>
                </Link>

                {["pending", "awaiting_payment"].includes(o.status) ? (
                  <Link href={`/api/payment/create?orderId=${o.id}`}>
                    <Button size="sm" className="font-mono text-[10px] uppercase tracking-wider font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none">
                      Bayar Sekarang
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/checkout/confirmation/${o.id}`}>
                    <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#6f6f6a] hover:text-[#f3f1eb] rounded-none">
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
