import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { orders, bookings, products } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { formatRupiah } from "@/lib/utils/format"

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan & Analisis Operasional</h1>
        <p className="text-muted-foreground text-sm">Metrik pendapatan dan tingkat utilitas layanan Noire Space.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-6 bg-card space-y-1">
          <p className="text-xs uppercase font-semibold text-muted-foreground">Total Omset Sukses</p>
          <p className="text-3xl font-bold text-emerald-500">{formatRupiah(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">{paidOrders.length} transaksi selesai</p>
        </div>
        <div className="rounded-lg border p-6 bg-card space-y-1">
          <p className="text-xs uppercase font-semibold text-muted-foreground">Rata-rata Nilai Transaksi (AOV)</p>
          <p className="text-3xl font-bold">
            {paidOrders.length > 0 ? formatRupiah(Math.round(totalRevenue / paidOrders.length)) : "Rp 0"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Distribusi Booking per Produk</h2>
        <div className="rounded-lg border divide-y bg-card">
          {bookingsByProduct.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Belum ada data distribusi sesi.</p>
          ) : (
            bookingsByProduct.map((item, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground">{item.productType}</span>
                  <p className="font-bold">{item.productName}</p>
                </div>
                <div className="font-bold text-base">{item.totalBookings} sesi</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
