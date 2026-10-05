import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserBookings } from "@/lib/modules/booking/booking.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

function getBadgeVariant(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    case "completed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30"
    case "cancelled":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30"
    default:
      return "bg-white/5 text-neutral-400 border-white/10"
  }
}

export default async function BookingsListPage() {
  const user = await requireAuth()
  const bookings = await getUserBookings(user.id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Calendar className="h-6 w-6 text-amber-400" />
          <span>Riwayat Booking Sesi</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Daftar seluruh jadwal sesi studio dan kelas edukasi yang pernah Anda reservasi.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-12 text-center space-y-4 bg-[#121217]">
          <p className="text-xs text-neutral-400">Anda belum memiliki riwayat reservasi jadwal sesi.</p>
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
          {bookings.map((b) => (
            <div key={b.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white">{b.bookingNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${getBadgeVariant(b.status)}`}>
                    {b.status}
                  </span>
                </div>
                <p className="font-bold text-base text-white">{b.productName}</p>
                <p className="text-xs text-neutral-400">
                  Tanggal: <strong className="text-white">{b.bookingDate}</strong> • Jam:{" "}
                  <strong className="text-amber-300">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</strong>
                </p>
              </div>
              <Link href={`/account/bookings/${b.id}`}>
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
  )
}
