import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getOrderById } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatDate, formatTime } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Clock, MapPin, Printer, ArrowLeft } from "lucide-react"

interface InvoiceBooking {
  id: string
  bookingNumber: string
  bookingDate: string
  startTime: string
  endTime: string
  participants: number
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoicePage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params
  const order = await getOrderById(id)

  const roles = (session.user as { roles?: string[] }).roles || []
  const isAdmin = roles.some((r: string) => ["admin", "super_admin"].includes(r))

  if (!order || (!isAdmin && order.customerId !== session.user.id)) {
    notFound()
  }

  const orderCustomer = await db.query.users.findFirst({
    where: eq(users.id, order.customerId),
  })

  const orderBookings: InvoiceBooking[] = (order.bookings || []) as InvoiceBooking[]

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 max-w-3xl">
      {/* Print-only Header */}
      <header className="print:block hidden mb-8 pb-6 border-b-2 border-black">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-black">NOIRE SPACE CREATIVE HUB</h1>
            <p className="text-xs text-neutral-600 mt-1">Jl. Puricitayam Permai, Rawapanjang, Kab.Bogor</p>
            <p className="text-xs text-neutral-600">noirespace.one@gmail.com • +62 882-1234-3431</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-600 uppercase tracking-wider">Faktur Resmi</p>
            <p className="text-lg font-bold font-mono text-black mt-1">#{order.orderNumber}</p>
            <p className="text-xs text-neutral-600 mt-1">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </header>

      {/* Screen Header */}
      <div className="print:hidden flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href={isAdmin ? "/admin/orders" : "/account/orders"} className="text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">Invoice & Bukti Pesanan</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">#{order.orderNumber}</h1>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => window.print()}
          variant="outline"
          className="h-10 text-xs uppercase tracking-widest font-semibold border-white/[0.12] text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2"
        >
          <Printer className="h-4 w-4 text-amber-400" />
          <span>Cetak / Simpan PDF</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Status Badge */}
        <div className="print:hidden">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs uppercase font-semibold ${
            order.status === "paid"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : order.status === "cancelled"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}>
            {order.status}
          </span>
        </div>

        {/* Customer Info & Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 print:border-black/20 print:bg-white print:p-4">
            <h2 className="font-bold text-base text-white print:text-black mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-400 print:text-black" />
              <span>Detail Pelanggan</span>
            </h2>
            <dl className="space-y-2 text-sm text-neutral-300 print:text-black">
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Nama</dt>
                <dd className="font-medium text-white print:text-black">{orderCustomer?.name || session.user.name || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Email</dt>
                <dd className="font-medium text-white print:text-black">{orderCustomer?.email || session.user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">No. Pesanan</dt>
                <dd className="font-mono font-bold text-white print:text-black">{order.orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Tanggal Pesanan</dt>
                <dd className="font-medium text-white print:text-black">{formatDate(order.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 print:border-black/20 print:bg-white print:p-4">
            <h2 className="font-bold text-base text-white print:text-black mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400 print:text-black" />
              <span>Ringkasan Pesanan</span>
            </h2>
            <dl className="space-y-2 text-sm text-neutral-300 print:text-black">
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Status Pembayaran</dt>
                <dd className="font-medium text-white print:text-black capitalize">{order.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Jumlah Item</dt>
                <dd className="font-medium text-white print:text-black">{order.items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Total Tagihan</dt>
                <dd className="font-bold text-white print:text-black">{formatRupiah(order.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-400 print:text-neutral-600">Jadwal Sesi</dt>
                <dd className="font-medium text-white print:text-black">{orderBookings.length > 0 ? `${orderBookings.length} sesi` : "-"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Booking Details */}
        {orderBookings.length > 0 && (
          <div className="rounded-xl border border-amber-400/20 bg-[#141311] p-6 print:border-black/20 print:bg-white">
            <h2 className="font-bold text-base text-white print:text-black mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400 print:text-black" />
              <span>Detail Jadwal Sesi</span>
            </h2>
            <div className="divide-y divide-white/[0.08] print:divide-black/10">
              {orderBookings.map((b, idx: number) => (
                <div key={b.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-sm text-white print:text-black font-medium">
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 print:bg-amber-100 print:text-amber-800 font-mono text-xs">
                        Sesi {idx + 1}
                      </span>
                      <span className="text-xs text-neutral-400 print:text-neutral-600 font-mono">#{b.bookingNumber}</span>
                    </div>
                    <span className="text-xs text-neutral-400 print:text-neutral-600 font-mono">{b.bookingDate}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white print:text-black">
                      <Clock className="h-4 w-4 text-amber-400 print:text-black" />
                      <span>{formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>
                    </div>
                    <div className="flex items-center gap-2 text-white print:text-black">
                      <MapPin className="h-4 w-4 text-amber-400 print:text-black" />
                      <span>Noire Space Creative Hub, Bogor</span>
                    </div>
                    <div className="flex items-center gap-2 text-white print:text-black">
                      <span className="px-2 py-0.5 rounded bg-white/[0.1] print:bg-neutral-100 text-xs font-medium">
                        {b.participants} Peserta
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itemized Breakdown */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 print:border-black/20 print:bg-white">
          <h2 className="font-bold text-base text-white print:text-black mb-4 flex items-center gap-2">
            <span className="h-4 w-4 text-amber-400 print:text-black">📋</span>
            <span>Rincian Biaya</span>
          </h2>
          <table className="w-full text-sm text-neutral-300 print:text-black">
            <thead>
              <tr className="border-b border-white/[0.08] print:border-black/20">
                <th className="text-left py-2 font-semibold text-white print:text-black">Layanan</th>
                <th className="text-right py-2 font-semibold text-white print:text-black w-20">Qty</th>
                <th className="text-right py-2 font-semibold text-white print:text-black w-32">Harga</th>
                <th className="text-right py-2 font-semibold text-white print:text-black w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08] print:divide-black/10">
              {order.items.map((item) => (
                <tr key={item.id} className="py-2">
                  <td className="text-white print:text-black">{item.description}</td>
                  <td className="text-right text-white print:text-black">{item.quantity}</td>
                  <td className="text-right text-white print:text-black">{formatRupiah(item.unitPrice)}</td>
                  <td className="text-right font-medium text-white print:text-black">{formatRupiah(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/[0.08] print:border-black/20">
                <td colSpan={3} className="text-right py-3 font-bold text-white print:text-black">TOTAL</td>
                <td className="text-right py-3 font-bold text-white print:text-black text-lg">{formatRupiah(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="print:hidden rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-3 text-xs text-neutral-400">
          <p><strong className="text-white">Catatan Penting:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Faktur ini bersifat sah sebagai bukti pemesanan resmi Noire Space.</li>
            <li>Booking bersifat <strong>non-refundable</strong>. Reschedule maksimal 1x dan minimal H-24 sebelum sesi.</li>
            <li>Harap hadir 10 menit sebelum jadwal sesi untuk persiapan.</li>
            <li>Pembayaran harus diselesaikan dalam 24 jam setelah pesanan dibuat agar jadwal tetap terjaga.</li>
          </ul>
        </div>

        {/* Print Footer Signature */}
        <footer className="print:block hidden mt-12 pt-6 border-t border-black space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-neutral-600 uppercase tracking-wider">Disetujui oleh</p>
              <p className="text-sm font-medium text-black mt-4">{session.user.name || "Pelanggan"}</p>
              <p className="text-xs text-neutral-500 mt-8 border-t border-dotted pt-2">Tanda Tangan</p>
            </div>
            <div>
              <p className="text-xs text-neutral-600 uppercase tracking-wider">Noire Space Admin</p>
              <p className="text-sm font-medium text-black mt-4">Tim Concierge</p>
              <p className="text-xs text-neutral-500 mt-8 border-t border-dotted pt-2">Tanda Tangan & Stempel</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}