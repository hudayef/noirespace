import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUserBookings } from "@/lib/modules/booking/booking.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

function getBadgeVariant(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    case "completed":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    case "cancelled":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default async function BookingsListPage() {
  const user = await requireAuth()
  const bookings = await getUserBookings(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Booking</h1>
        <p className="text-muted-foreground text-sm">Daftar seluruh jadwal sesi kelas dan studio yang pernah Anda pesan.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center space-y-4">
          <p className="text-muted-foreground">Anda belum memiliki riwayat reservasi.</p>
          <Link href="/studio">
            <Button size="sm">Pesan Studio Sekarang</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border divide-y">
          {bookings.map((b) => (
            <div key={b.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{b.bookingNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase ${getBadgeVariant(b.status)}`}>
                    {b.status}
                  </span>
                </div>
                <p className="font-bold text-base">{b.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Tanggal: {b.bookingDate} | Jam: {formatTime(b.startTime)} - {formatTime(b.endTime)} WIB
                </p>
              </div>
              <Link href={`/account/bookings/${b.id}`}>
                <Button variant="outline" size="sm">Rincian</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
