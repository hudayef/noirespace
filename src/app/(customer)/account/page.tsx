import Link from "next/link"
import { requireAuth } from "@/lib/modules/auth/rbac"
import { getUpcomingBookings, getUserBookings } from "@/lib/modules/booking/booking.service"
import { getUserOrders } from "@/lib/modules/commerce/order.service"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function AccountPage() {
  const user = await requireAuth()
  const upcoming = await getUpcomingBookings(user.id)
  const allBookings = await getUserBookings(user.id)
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, {user.name}</h1>
        <p className="text-muted-foreground text-sm">Kelola jadwal sesi dan riwayat pemesanan Anda di Noire Space.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-6 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Sesi Mendatang</p>
          <p className="text-3xl font-bold mt-2">{upcoming.length}</p>
        </div>
        <div className="rounded-lg border p-6 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Booking</p>
          <p className="text-3xl font-bold mt-2">{allBookings.length}</p>
        </div>
        <div className="rounded-lg border p-6 bg-card">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Pesanan</p>
          <p className="text-3xl font-bold mt-2">{orders.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Jadwal Sesi Terdekat</h2>
          <Link href="/account/bookings" className="text-xs underline text-muted-foreground hover:text-foreground">
            Lihat Semua
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Belum ada sesi booking terkonfirmasi yang akan datang.</p>
            <Link href="/programs">
              <Button size="sm">Cari Program atau Studio</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border divide-y">
            {upcoming.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-xs uppercase font-semibold text-muted-foreground">{item.productType}</span>
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.bookingDate} | {formatTime(item.startTime)} - {formatTime(item.endTime)} WIB
                  </p>
                </div>
                <Link href={`/account/bookings/${item.id}`}>
                  <Button variant="outline" size="sm">Kelola Sesi</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
