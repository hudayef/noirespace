import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUpcomingBookings, getUserBookings } from "@/lib/modules/booking/booking.service"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export default async function AccountPage() {
  const user = await requireAuth()
  const upcoming = await getUpcomingBookings(user.id)
  const allBookings = await getUserBookings(user.id)
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Selamat Datang, {user.name}</h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Kelola jadwal sesi studio, kelas edukasi, dan riwayat pesanan Anda di Noire Space.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.08] p-6 bg-[#121217] space-y-1">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Sesi Mendatang</p>
          <p className="text-3xl font-extrabold text-white mt-1">{upcoming.length}</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] p-6 bg-[#121217] space-y-1">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Total Booking</p>
          <p className="text-3xl font-extrabold text-white mt-1">{allBookings.length}</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] p-6 bg-[#121217] space-y-1">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Total Transaksi</p>
          <p className="text-3xl font-extrabold text-white mt-1">{orders.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Jadwal Sesi Terdekat</span>
          </h2>
          <Link href="/account/bookings" className="text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors">
            Lihat Semua →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-10 text-center space-y-4 bg-[#121217]">
            <p className="text-xs text-neutral-400">Belum ada sesi booking terkonfirmasi yang akan datang.</p>
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
            {upcoming.slice(0, 3).map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
                    {item.productType}
                  </span>
                  <p className="font-bold text-white text-base">{item.productName}</p>
                  <p className="text-xs text-neutral-400">
                    Tanggal: <strong className="text-white">{item.bookingDate}</strong> • Jam:{" "}
                    <strong className="text-amber-300">{formatTime(item.startTime)} - {formatTime(item.endTime)} WIB</strong>
                  </p>
                </div>
                <Link href={`/account/bookings/${item.id}`}>
                  <Button variant="outline" size="sm" className="text-xs border-white/[0.12] text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-1.5">
                    <span>Kelola Sesi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
