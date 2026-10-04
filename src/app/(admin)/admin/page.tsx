import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, orders, users, schoolInquiries, products } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { formatRupiah, formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  await requireAdmin()

  const today = new Date().toISOString().split("T")[0]

  const todayBookings = await db.query.bookings.findMany({
    where: eq(bookings.bookingDate, today),
    orderBy: [bookings.startTime],
  })

  const pendingPayments = await db.query.orders.findMany({
    where: eq(orders.status, "awaiting_payment"),
  })

  const totalCustomers = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)

  const activeProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.status, "published"))

  const newInquiries = await db.query.schoolInquiries.findMany({
    where: eq(schoolInquiries.status, "new"),
  })

  const paidOrders = await db.query.orders.findMany({
    where: eq(orders.status, "paid"),
  })
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OPERATIONAL DASHBOARD</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pusat kendali operasional harian, transaksi, dan jadwal Noire Space.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Ringkasan Hari Ini ({today})</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-md border bg-background">
            <p className="text-xs text-muted-foreground">Booking Hari Ini</p>
            <p className="text-2xl font-bold mt-1">{todayBookings.length}</p>
          </div>
          <div className="p-4 rounded-md border bg-background">
            <p className="text-xs text-muted-foreground">Menunggu Pembayaran</p>
            <p className="text-2xl font-bold mt-1 text-amber-500">{pendingPayments.length}</p>
          </div>
          <div className="p-4 rounded-md border bg-background">
            <p className="text-xs text-muted-foreground">Pengajuan Sekolah Baru</p>
            <p className="text-2xl font-bold mt-1 text-blue-500">{newInquiries.length}</p>
          </div>
          <div className="p-4 rounded-md border bg-background">
            <p className="text-xs text-muted-foreground">Katalog Aktif</p>
            <p className="text-2xl font-bold mt-1">{activeProducts[0]?.count || 0}</p>
          </div>
          <div className="p-4 rounded-md border bg-background">
            <p className="text-xs text-muted-foreground">Total Pendapatan</p>
            <p className="text-xl font-bold mt-1 text-emerald-500">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Jadwal Sesi Hari Ini</h2>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm">Semua Booking</Button>
            </Link>
          </div>

          {todayBookings.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Tidak ada agenda sesi studio atau kelas yang terjadwal untuk hari ini.
            </div>
          ) : (
            <div className="rounded-lg border divide-y">
              {todayBookings.map((b) => (
                <div key={b.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">{b.bookingNumber}</span>
                    <p className="font-bold text-sm">
                      {formatTime(b.startTime)} - {formatTime(b.endTime)} WIB
                    </p>
                    <p className="text-xs text-muted-foreground">Kapasitas: {b.participants} orang</p>
                  </div>
                  <span className="text-xs font-semibold uppercase px-2 py-1 rounded border bg-muted">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Aksi Cepat Operasional</h2>
          <div className="rounded-lg border p-6 space-y-3 bg-card">
            <Link href="/admin/products" className="block">
              <Button variant="outline" className="w-full justify-start text-xs">
                + Tambah Produk / Kelas Baru
              </Button>
            </Link>
            <Link href="/admin/schedules" className="block">
              <Button variant="outline" className="w-full justify-start text-xs">
                + Atur Template Jadwal & Jam Kerja
              </Button>
            </Link>
            <Link href="/admin/inquiries" className="block">
              <Button variant="outline" className="w-full justify-start text-xs">
                Lihat Pengajuan Sekolah ({newInquiries.length})
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button variant="outline" className="w-full justify-start text-xs">
                Laporan Keuangan & Utilitas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
