import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { orders, bookings, products } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { formatRupiah } from "@/lib/utils/format"
import { BarChart3 } from "lucide-react"

export default async function AdminReportsPage() {
  await requireAdmin()

  const paidOrders = await db.query.orders.findMany({
    where: eq(orders.status, "paid"),
  })
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  const bookingsByProduct = await db
    .select({
      productName: products.name,
      productType: products.type,
      totalBookings: sql<number>`count(${bookings.id})`,
    })
    .from(bookings)
    .innerJoin(products, eq(bookings.productId, products.id))
    .groupBy(products.name, products.type)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-[#f3f1eb]" />
          <span>Laporan & Analisis Operasional</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Metrik pendapatan, omset transaksi, dan tingkat utilitas layanan Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.08] p-6 bg-[#121217] space-y-1">
          <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Omset Sukses</p>
          <p className="text-3xl font-extrabold text-[#f3f1eb]">{formatRupiah(totalRevenue)}</p>
          <p className="text-xs text-neutral-500">{paidOrders.length} transaksi pembayaran selesai</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] p-6 bg-[#121217] space-y-1">
          <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Rata-rata Nilai Transaksi (AOV)</p>
          <p className="text-3xl font-extrabold text-white">
            {paidOrders.length > 0 ? formatRupiah(Math.round(totalRevenue / paidOrders.length)) : "Rp 0"}
          </p>
          <p className="text-xs text-neutral-500">Estimasi spending rata-rata per pesanan</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Distribusi Booking per Produk</h2>
        <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
          {bookingsByProduct.length === 0 ? (
            <p className="p-8 text-center text-xs text-neutral-400">Belum ada data distribusi sesi.</p>
          ) : (
            bookingsByProduct.map((item, idx) => (
              <div key={idx} className="p-5 flex justify-between items-center text-sm">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
                    {item.productType}
                  </span>
                  <p className="font-bold text-white mt-1">{item.productName}</p>
                </div>
                <div className="font-mono font-extrabold text-base text-[#e8e6df]">{item.totalBookings} sesi</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
