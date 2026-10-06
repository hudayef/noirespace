import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUpcomingBookings, getUserBookings } from "@/lib/modules/booking/booking.service"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/editorial"
import { Calendar, ArrowRight } from "lucide-react"

export default async function AccountPage() {
  const user = await requireAuth()
  const upcoming = await getUpcomingBookings(user.id)
  const allBookings = await getUserBookings(user.id)
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SectionLabel number="01" label="DASHBOARD PELANGGAN" />
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#f3f1eb] font-normal">
          Selamat Datang, {user.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Pusat kendali reservasi studio foto, kelas edukasi, dan riwayat pesanan Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="border border-[#f3f1eb]/[0.1] p-6 bg-[#111111] space-y-1">
          <p className="text-[10px] text-[#6f6f6a] uppercase tracking-wider">SESI MENDATANG</p>
          <p className="text-3xl font-bold text-[#f3f1eb] mt-1">{upcoming.length}</p>
        </div>
        <div className="border border-[#f3f1eb]/[0.1] p-6 bg-[#111111] space-y-1">
          <p className="text-[10px] text-[#6f6f6a] uppercase tracking-wider">TOTAL RESERVASI</p>
          <p className="text-3xl font-bold text-[#f3f1eb] mt-1">{allBookings.length}</p>
        </div>
        <div className="border border-[#f3f1eb]/[0.1] p-6 bg-[#111111] space-y-1">
          <p className="text-[10px] text-[#6f6f6a] uppercase tracking-wider">TOTAL TRANSAKSI</p>
          <p className="text-3xl font-bold text-[#f3f1eb] mt-1">{orders.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#f3f1eb]/[0.08] pb-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#f3f1eb] flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-[#6f6f6a]" />
            <span>Jadwal Sesi Terdekat</span>
          </h2>
          <Link href="/account/bookings" className="font-mono text-[10px] uppercase tracking-wider text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors">
            Lihat Semua →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="border border-dashed border-[#f3f1eb]/[0.15] p-10 text-center space-y-4 bg-[#111111]">
            <p className="font-mono text-xs text-[#6f6f6a]">Belum ada sesi booking terkonfirmasi yang akan datang.</p>
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
            {upcoming.slice(0, 3).map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#f3f1eb]/[0.1] text-[#6f6f6a]">
                    {item.productType}
                  </span>
                  <p className="font-display text-base text-[#f3f1eb] font-normal">{item.productName}</p>
                  <p className="font-mono text-[11px] text-[#6f6f6a]">
                    Tanggal: <strong className="text-[#f3f1eb]">{item.bookingDate}</strong> · Jam:{" "}
                    <strong className="text-[#e8e6df]">{formatTime(item.startTime)} - {formatTime(item.endTime)} WIB</strong>
                  </p>
                </div>
                <Link href={`/account/bookings/${item.id}`}>
                  <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1.5">
                    <span>Kelola Sesi</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
