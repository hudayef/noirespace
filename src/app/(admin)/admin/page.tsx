import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, orders, schoolInquiries, products } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { formatRupiah, formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, ArrowRight } from "lucide-react"

function getStatusBadge(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    case "completed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    case "pending":
    case "awaiting_payment":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30"
    case "cancelled":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30"
    default:
      return "bg-white/5 text-neutral-400 border-white/10"
  }
}

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
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <LayoutDashboard className="h-6 w-6 text-amber-400" />
          <span>Console Operasional Harian</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Pusat pemantauan transaksi, utilisasi studio, dan jadwal Noire Space.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Ringkasan Hari Ini ({today})</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#09090b] space-y-1">
            <p className="text-[11px] text-neutral-400">Sesi Hari Ini</p>
            <p className="text-2xl font-extrabold text-white">{todayBookings.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#09090b] space-y-1">
            <p className="text-[11px] text-neutral-400">Menunggu Pembayaran</p>
            <p className="text-2xl font-extrabold text-amber-400">{pendingPayments.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#09090b] space-y-1">
            <p className="text-[11px] text-neutral-400">Inquiry Sekolah Baru</p>
            <p className="text-2xl font-extrabold text-indigo-400">{newInquiries.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#09090b] space-y-1">
            <p className="text-[11px] text-neutral-400">Layanan Aktif</p>
            <p className="text-2xl font-extrabold text-white">{activeProducts[0]?.count || 0}</p>
          </div>
          <div className="p-4 rounded-lg border border-white/[0.06] bg-[#09090b] space-y-1">
            <p className="text-[11px] text-neutral-400">Total Omset Sukses</p>
            <p className="text-lg sm:text-xl font-extrabold text-emerald-400">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>Jadwal Sesi Hari Ini</span>
            </h2>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="text-xs border-white/[0.12] text-neutral-300 hover:text-white flex items-center gap-1">
                <span>Semua Booking</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {todayBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-neutral-400 bg-[#121217]">
              Tidak ada agenda sesi studio atau kelas yang terjadwal untuk hari ini.
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
              {todayBookings.map((b) => (
                <div key={b.id} className="p-4 sm:p-5 flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-white">{b.bookingNumber}</span>
                    <p className="font-bold text-white">
                      <span className="text-amber-300">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>
                    </p>
                    <p className="text-xs text-neutral-400">Kapasitas: {b.participants} orang</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Aksi Cepat Operasional</h2>
          <div className="rounded-xl border border-white/[0.08] p-5 space-y-2.5 bg-[#121217]">
            <Link href="/admin/products" className="block">
              <Button variant="outline" className="w-full justify-start text-xs border-white/[0.12] text-neutral-300 hover:text-white hover:bg-white/[0.06] h-10">
                + Tambah Produk / Kelas Baru
              </Button>
            </Link>
            <Link href="/admin/schedules" className="block">
              <Button variant="outline" className="w-full justify-start text-xs border-white/[0.12] text-neutral-300 hover:text-white hover:bg-white/[0.06] h-10">
                + Atur Template Jadwal & Jam Kerja
              </Button>
            </Link>
            <Link href="/admin/inquiries" className="block">
              <Button variant="outline" className="w-full justify-start text-xs border-white/[0.12] text-neutral-300 hover:text-white hover:bg-white/[0.06] h-10">
                Lihat Pengajuan Sekolah ({newInquiries.length})
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button variant="outline" className="w-full justify-start text-xs border-white/[0.12] text-neutral-300 hover:text-white hover:bg-white/[0.06] h-10">
                Laporan Keuangan & Utilitas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
