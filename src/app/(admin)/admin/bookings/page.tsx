import { revalidatePath } from "next/cache"
import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, products, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { BookOpen, Save, MessageSquare, FileText } from "lucide-react"

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  completed: "bg-neutral-500/10 text-neutral-300 border-neutral-500/30",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  no_show: "bg-purple-500/10 text-purple-400 border-purple-500/30",
}

export default async function AdminBookingsPage() {
  await requireAdmin()

  const allBookings = await db
    .select({
      id: bookings.id,
      orderId: bookings.orderId,
      bookingNumber: bookings.bookingNumber,
      bookingDate: bookings.bookingDate,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      participants: bookings.participants,
      status: bookings.status,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
      productName: products.name,
    })
    .from(bookings)
    .innerJoin(products, eq(bookings.productId, products.id))
    .innerJoin(users, eq(bookings.customerId, users.id))
    .orderBy(desc(bookings.bookingDate))

  async function handleUpdateStatus(formData: FormData) {
    "use server"
    await requireAdmin()
    const id = formData.get("id") as string
    const status = formData.get("status") as "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
    if (!id || !status) return

    await db.update(bookings).set({ status, updatedAt: new Date() }).where(eq(bookings.id, id))
    revalidatePath("/admin/bookings")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <BookOpen className="h-6 w-6 text-amber-400" />
          <span>Seluruh Booking Sesi</span>
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Monitor dan ubah status booking, konfirmasi kehadiran, dan hubungi pelanggan via WhatsApp.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {allBookings.length === 0 ? (
          <p className="p-8 text-center text-xs text-neutral-400">Belum ada data booking.</p>
        ) : (
          allBookings.map((b) => {
            const cleanPhone = (b.customerPhone || "").replace(/[^0-9]/g, "")
            const waTarget = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone
            const waMessage = encodeURIComponent(
              `Halo Kak ${b.customerName},\n\n` +
              `Kami dari tim Noire Space ingin mengonfirmasi sesi ${b.productName} Anda pada ${b.bookingDate} (${formatTime(b.startTime)} - ${formatTime(b.endTime)} WIB) dengan nomor booking #${b.bookingNumber}.\n` +
              `Mohon hadir 10 menit lebih awal. Sampai jumpa di studio!`
            )
            const waUrl = cleanPhone ? `https://wa.me/${waTarget}?text=${waMessage}` : null

            return (
              <div key={b.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white">{b.bookingNumber}</span>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusColors[b.status] || ""}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-white">{b.productName}</p>
                  <p className="text-xs text-neutral-400">
                    {b.customerName} ({b.customerEmail}) {b.customerPhone ? `• ${b.customerPhone}` : ""} • {b.participants} orang
                  </p>
                  <p className="text-xs text-neutral-500">
                    Jadwal: <span className="text-neutral-300">{b.bookingDate}</span> (
                    <span className="text-amber-300">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                      title="Hubungi via WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span>WA</span>
                    </a>
                  )}

                  {b.orderId && (
                    <Link href={`/account/orders/${b.orderId}/invoice`} target="_blank">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-white/[0.12] text-neutral-300 hover:text-white flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-amber-400" />
                        <span>Faktur</span>
                      </Button>
                    </Link>
                  )}

                  <form action={handleUpdateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={b.id} />
                    <select
                      name="status"
                      defaultValue={b.status}
                      aria-label={`Ubah status booking ${b.bookingNumber}`}
                      className="rounded-md border border-white/[0.12] bg-[#09090b] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No Show</option>
                    </select>
                    <Button
                      type="submit"
                      size="xs"
                      variant="outline"
                      className="text-[11px] font-semibold border-white/20 text-neutral-300 hover:bg-white/10 flex items-center gap-1"
                    >
                      <Save className="h-3 w-3" />
                      <span>Simpan</span>
                    </Button>
                  </form>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
