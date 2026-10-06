import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, orders, schoolInquiries, products } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { formatRupiah, formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { SectionLabel, StatusBadge } from "@/components/editorial"
import { Calendar, ArrowRight } from "lucide-react"

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
        <SectionLabel number="01" label="DASHBOARD OPERASIONAL" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">
          Console Harian
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Pemantauan transaksi, utilisasi studio, dan jadwal Noire Space.
        </p>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6f6a]">
          RINGKASAN HARI INI ({today})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a]">SESI HARI INI</p>
            <p className="text-2xl font-bold text-[#f3f1eb]">{todayBookings.length}</p>
          </div>
          <div className="p-4 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a]">MENUNGGU PEMBAYARAN</p>
            <p className="text-2xl font-bold text-[#f3f1eb]">{pendingPayments.length}</p>
          </div>
          <div className="p-4 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a]">INQUIRY SEKOLAH BARU</p>
            <p className="text-2xl font-bold text-[#f3f1eb]">{newInquiries.length}</p>
          </div>
          <div className="p-4 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a]">LAYANAN AKTIF</p>
            <p className="text-2xl font-bold text-[#f3f1eb]">{activeProducts[0]?.count || 0}</p>
          </div>
          <div className="p-4 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a]">OMSET TERCAPAI</p>
            <p className="text-lg sm:text-xl font-bold text-[#f3f1eb]">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-[#f3f1eb]/[0.08] pb-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3f1eb] flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#6f6f6a]" />
              <span>JADWAL SESI HARI INI</span>
            </h2>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#6f6f6a] hover:text-[#f3f1eb] hover:bg-[#111111] rounded-none flex items-center gap-1">
                <span>SEMUA BOOKING</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {todayBookings.length === 0 ? (
            <div className="border border-dashed border-[#f3f1eb]/[0.1] p-8 text-center font-mono text-xs text-[#6f6f6a] bg-[#111111]">
              Tidak ada agenda sesi studio atau kelas yang terjadwal untuk hari ini.
            </div>
          ) : (
            <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
              {todayBookings.map((b) => (
                <div key={b.id} className="p-4 sm:p-5 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-[#f3f1eb]">{b.bookingNumber}</span>
                    <p className="font-mono text-sm text-[#e8e6df]">
                      {formatTime(b.startTime)} - {formatTime(b.endTime)} WIB
                    </p>
                    <p className="text-xs text-[#6f6f6a]">Kapasitas: {b.participants} orang</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#f3f1eb]">
            AKSI OPERASIONAL
          </h2>
          <div className="border border-[#f3f1eb]/[0.1] p-5 space-y-2.5 bg-[#111111]">
            <Link href="/admin/products" className="block">
              <Button variant="outline" className="w-full justify-start font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#0a0a0a] rounded-none h-10">
                + Tambah Produk / Kelas Baru
              </Button>
            </Link>
            <Link href="/admin/schedules" className="block">
              <Button variant="outline" className="w-full justify-start font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#0a0a0a] rounded-none h-10">
                + Atur Template Jadwal & Jam Kerja
              </Button>
            </Link>
            <Link href="/admin/inquiries" className="block">
              <Button variant="outline" className="w-full justify-start font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#0a0a0a] rounded-none h-10">
                Lihat Pengajuan Sekolah ({newInquiries.length})
              </Button>
            </Link>
            <Link href="/admin/reports" className="block">
              <Button variant="outline" className="w-full justify-start font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#0a0a0a] rounded-none h-10">
                Laporan Keuangan & Utilitas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
