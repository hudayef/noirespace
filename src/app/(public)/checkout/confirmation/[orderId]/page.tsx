import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { getOrderById } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatTime, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { AddToCalendar } from "@/components/features/booking/add-to-calendar"
import { OrderConfirmationActions } from "@/components/features/commerce/order-confirmation-actions"
import { Calendar, Clock } from "lucide-react"

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function ConfirmationPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { orderId } = await params
  const order = await getOrderById(orderId)

  if (!order || order.customerId !== session.user.id) {
    notFound()
  }

  const orderBookings = order.bookings || []

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 max-w-2xl space-y-8">
      {/* Official Header for Print & Web */}
      <div className="hidden print:block border-b pb-4 mb-4 text-black">
        <h2 className="text-xl font-bold tracking-wider">NOIRE SPACE CREATIVE HUB</h2>
        <p className="text-xs">Puri Citayam Permai, Citayam • noirespace.one@gmail.com</p>
        <p className="text-xs font-mono mt-1">FAKTUR / BUKTI PEMESANAN RESMI #{order.orderNumber}</p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-8 text-center space-y-4 print:border-none print:p-0">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xl print:hidden">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white print:text-black">
          {order.status === "paid" ? "Faktur Pembayaran Lunas" : "Pesanan Berhasil Dibuat"}
        </h1>
        <p className="text-neutral-400 text-sm print:text-neutral-600">
          Nomor Pesanan: <span className="font-mono font-bold text-white print:text-black">{order.orderNumber}</span> • {formatDate(order.createdAt)}
        </p>
      </div>

      {orderBookings.length > 0 && (
        <div className="rounded-xl border border-amber-400/20 bg-[#141311] p-6 space-y-5 print:border-black/20 print:bg-white">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400 print:text-black" />
            <h2 className="font-bold text-base text-white print:text-black">Jadwal Sesi Terdaftar</h2>
          </div>
          <div className="divide-y divide-white/[0.08] print:divide-black/10">
            {orderBookings.map((b) => (
              <div key={b.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <div className="flex items-center gap-2 text-white print:text-black font-medium">
                    <Clock className="h-4 w-4 text-amber-400 print:text-black" />
                    <span>{b.bookingDate} • {formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>
                  </div>
                  <span className="text-xs text-neutral-400 print:text-neutral-600 font-mono">{b.bookingNumber}</span>
                </div>
                <div className="print:hidden">
                  <AddToCalendar
                    title={`Sesi Noire Space - ${order.orderNumber}`}
                    description={`Reservasi Noire Space #${b.bookingNumber}. Harap hadir 10 menit sebelum sesi dimulai.`}
                    date={b.bookingDate}
                    startTime={b.startTime}
                    endTime={b.endTime}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4 print:border-black/20 print:bg-white">
        <h2 className="font-bold text-lg text-white print:text-black">Rincian Pembayaran</h2>
        <div className="divide-y divide-white/[0.08] print:divide-black/10 text-sm text-neutral-300 print:text-black">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <span>{item.description} ({item.quantity}x)</span>
              <span className="font-medium text-white print:text-black">{formatRupiah(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.08] print:border-black/20 pt-4 flex justify-between items-center font-bold text-lg">
          <span className="text-white print:text-black">Total</span>
          <span className="text-white print:text-black">{formatRupiah(order.total)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-neutral-400 print:text-neutral-600">
          <span>Status Pembayaran</span>
          <span className="uppercase font-semibold text-amber-400 print:text-black">{order.status}</span>
        </div>
      </div>

      {/* Action Strip: Midtrans Payment, Print Invoice, WhatsApp Concierge */}
      <OrderConfirmationActions
        orderNumber={order.orderNumber}
        totalText={formatRupiah(order.total)}
        customerName={session.user.name || undefined}
        orderStatus={order.status}
        paymentUrl={`/api/payment/create?orderId=${order.id}`}
      />

      <div className="print:hidden text-center pt-2">
        <Link href="/account/orders">
          <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white">
            ← Kembali ke Daftar Pesanan Saya
          </Button>
        </Link>
      </div>
    </div>
  )
}
