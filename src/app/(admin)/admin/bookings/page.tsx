import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, products, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

export default async function AdminBookingsPage() {
  await requireAdmin()

  const allBookings = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      bookingDate: bookings.bookingDate,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      participants: bookings.participants,
      status: bookings.status,
      customerName: users.name,
      customerEmail: users.email,
      productName: products.name,
    })
    .from(bookings)
    .innerJoin(products, eq(bookings.productId, products.id))
    .innerJoin(users, eq(bookings.customerId, users.id))
    .orderBy(desc(bookings.bookingDate))

  async function handleUpdateStatus(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const status = formData.get("status") as any
    if (!id || !status) return

    await db.update(bookings).set({ status, updatedAt: new Date() }).where(eq(bookings.id, id))
    revalidatePath("/admin/bookings")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Seluruh Booking</h1>
        <p className="text-muted-foreground text-sm">Monitor seluruh pemesanan sesi, ubah status, dan kelola kehadiran.</p>
      </div>

      <div className="rounded-lg border divide-y bg-card">
        {allBookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada data booking.</p>
        ) : (
          allBookings.map((b) => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold">{b.bookingNumber}</span>
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded border bg-muted">
                    {b.status}
                  </span>
                </div>
                <p className="font-bold">{b.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Pelanggan: {b.customerName} ({b.customerEmail}) | Kapasitas: {b.participants} orang
                </p>
                <p className="text-xs text-muted-foreground">
                  Jadwal: {b.bookingDate} ({formatTime(b.startTime)} - {formatTime(b.endTime)} WIB)
                </p>
              </div>

              <form action={handleUpdateStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={b.id} />
                <select name="status" defaultValue={b.status} className="rounded-md border bg-background px-2 py-1 text-xs">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
                <Button type="submit" size="sm" variant="outline" className="text-xs">
                  Update
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
