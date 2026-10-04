import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function CustomerOrdersPage() {
  const user = await requireAuth()
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Pesanan</h1>
        <p className="text-muted-foreground text-sm">Daftar seluruh transaksi pemesanan dan status pembayarannya.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center space-y-4">
          <p className="text-muted-foreground">Belum ada riwayat transaksi pesanan.</p>
          <Link href="/programs">
            <Button size="sm">Mulai Berlangganan Layanan</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border divide-y">
          {orders.map((o) => (
            <div key={o.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold">{o.orderNumber}</span>
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full border font-semibold bg-muted">
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                <p className="font-bold text-base">{formatRupiah(o.total)}</p>
              </div>

              <div>
                {["pending", "awaiting_payment"].includes(o.status) ? (
                  <Link href={`/api/payment/create?orderId=${o.id}`}>
                    <Button size="sm">Bayar Sekarang</Button>
                  </Link>
                ) : (
                  <Link href={`/checkout/confirmation/${o.id}`}>
                    <Button variant="outline" size="sm">Lihat Bukti</Button>
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
