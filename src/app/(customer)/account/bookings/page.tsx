import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserBookings } from "@/lib/modules/booking/booking.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { StatusBadge } from "@/components/editorial"

export default async function BookingsListPage() {
  const user = await requireAuth()
  const bookings = await getUserBookings(user.id)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6a]">01 / SESI</span>
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">RIWAYAT BOOKING</h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">Daftar seluruh jadwal sesi studio dan kelas edukasi yang pernah Anda reservasi.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-[#f3f1eb]/[0.15] p-12 text-center space-y-4 bg-[#111111]">
          <p className="font-mono text-xs text-[#6f6f6a]">Belum ada riwayat reservasi sesi.</p>
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
          {bookings.map((b) => (
            <div key={b.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#f3f1eb]">{b.bookingNumber}</span>
                  <StatusBadge status={b.status} />
                </div>
                <p className="font-display text-lg text-[#f3f1eb] font-normal">{b.productName}</p>
                <p className="font-mono text-[11px] text-[#6f6f6a]">
                  Tanggal: <strong className="text-[#f3f1eb]">{b.bookingDate}</strong> · Jam: <strong className="text-[#e8e6df]">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</strong>
                </p>
              </div>
              <Link href={`/account/bookings/${b.id}`}>
                <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1.5">
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
