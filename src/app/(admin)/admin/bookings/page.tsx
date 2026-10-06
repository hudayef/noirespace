import { revalidatePath } from "next/cache"
import Link from "next/link"
import { requireAdmin } from "@/lib/modules/auth/rbac"
import { db } from "@/lib/db"
import { bookings, products, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { SectionLabel, StatusBadge } from "@/components/editorial"
import { Save, MessageSquare, FileText } from "lucide-react"

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
        <SectionLabel number="01" label="MANAJEMEN OPERASIONAL" />
        <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">
          Seluruh Booking Sesi
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6a]">
          Monitor status booking, konfirmasi jadwal kehadiran, dan hubungi pelanggan via WhatsApp.
        </p>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
        {allBookings.length === 0 ? (
          <p className="p-8 text-center font-mono text-xs text-[#6f6f6a]">Belum ada data booking.</p>
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
                <div className="space-y-1.5 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#f3f1eb]">{b.bookingNumber}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="font-sans font-medium text-sm text-[#f3f1eb]">{b.productName}</p>
                  <p className="text-xs text-[#6f6f6a]">
                    {b.customerName} ({b.customerEmail}) {b.customerPhone ? `• ${b.customerPhone}` : ""} • {b.participants} orang
                  </p>
                  <p className="text-xs text-[#6f6f6a]">
                    Jadwal: <span className="text-[#e8e6df]">{b.bookingDate}</span> (
                    <span className="text-[#f3f1eb] font-medium">{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#f3f1eb]/[0.15] bg-[#141414] text-[#e8e6df] hover:text-[#f3f1eb] font-mono text-xs transition-colors"
                      title="Hubungi via WhatsApp"
                    >
                      <MessageSquare className="h-3 w-3 text-[#6f6f6a]" />
                      <span>WA</span>
                    </a>
                  )}

                  {b.orderId && (
                    <Link href={`/account/orders/${b.orderId}/invoice`} target="_blank">
                      <Button variant="outline" size="sm" className="h-8 font-mono text-xs border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1">
                        <FileText className="h-3 w-3 text-[#6f6f6a]" />
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
                      className="border border-[#f3f1eb]/[0.15] bg-[#0a0a0a] px-2.5 py-1.5 font-mono text-xs text-[#f3f1eb] focus:outline-none focus:border-[#f3f1eb]/[0.4]"
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
                      className="font-mono text-[10px] uppercase border-[#f3f1eb]/[0.2] text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-1 h-8"
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
