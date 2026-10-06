import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { getOrderById } from "@/lib/modules/commerce/order.service"
import { formatRupiah, formatTime, formatDate } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { AddToCalendar } from "@/components/features/booking/add-to-calendar"
import { OrderConfirmationActions } from "@/components/features/commerce/order-confirmation-actions"
import { StatusBadge } from "@/components/editorial"
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
    <div className="container mx-auto px-6 lg:px-12 py-16 max-w-2xl space-y-8">
      {/* Official Header for Print & Web */}
      <div className="hidden print:block border-b pb-4 mb-4 text-black">
        <h2 className="text-xl font-bold tracking-wider">NOIRE SPACE CREATIVE HUB</h2>
        <p className="text-xs">Bogor • noirespace.one@gmail.com</p>
        <p className="text-xs font-mono mt-1">FAKTUR / BUKTI PEMESANAN RESMI #{order.orderNumber}</p>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 sm:p-10 text-center space-y-4 print:border-none print:p-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6f6f6a] block">
          01 / STATUS TRANSAKSI
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#f3f1eb] font-normal print:text-black">
          {order.status === "paid" ? "Faktur Pembayaran Lunas" : "Pesanan Terkonfirmasi"}
        </h1>
        <p className="font-mono text-xs text-[#6f6f6a] print:text-neutral-600">
          NOMOR PESANAN: <span className="text-[#f3f1eb] font-medium print:text-black">{order.orderNumber}</span> · {formatDate(order.createdAt)}
        </p>
      </div>

      {orderBookings.length > 0 && (
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-5 print:border-black/20 print:bg-white">
          <div className="flex items-center justify-between border-b border-[#f3f1eb]/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#e8e6df] print:text-black" />
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3f1eb] print:text-black">
                Jadwal Sesi Terdaftar
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#6f6f6a]">
              {orderBookings.length} SESI
            </span>
          </div>

          <div className="divide-y divide-[#f3f1eb]/[0.08] print:divide-black/10">
            {orderBookings.map((b) => (
              <div key={b.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2 text-[#f3f1eb] print:text-black">
                    <Clock className="h-3.5 w-3.5 text-[#6f6f6a] print:text-black" />
                    <span>{b.bookingDate} · {formatTime(b.startTime)} - {formatTime(b.endTime)} WIB</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#6f6f6a] print:text-neutral-600">{b.bookingNumber}</span>
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

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4 print:border-black/20 print:bg-white">
        <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3f1eb] print:text-black">
          Rincian Pembayaran
        </h2>
        <div className="divide-y divide-[#f3f1eb]/[0.08] print:divide-black/10 text-xs text-[#e8e6df] print:text-black">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <span>{item.description} ({item.quantity}x)</span>
              <span className="font-mono text-[#f3f1eb] print:text-black">{formatRupiah(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#f3f1eb]/[0.08] print:border-black/20 pt-4 flex justify-between items-center font-mono">
          <span className="text-xs uppercase tracking-wider text-[#6f6f6a] print:text-black">Total Transaksi</span>
          <span className="text-base font-bold text-[#f3f1eb] print:text-black">{formatRupiah(order.total)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#6f6f6a] print:text-neutral-600 pt-1">
          <span className="font-mono text-[11px]">STATUS</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Action Strip: Payment, Print Invoice, WhatsApp Concierge */}
      <OrderConfirmationActions
        orderNumber={order.orderNumber}
        totalText={formatRupiah(order.total)}
        customerName={session.user.name || undefined}
        orderStatus={order.status}
        paymentUrl={`/api/payment/create?orderId=${order.id}`}
      />

      <div className="print:hidden text-center pt-2">
        <Link href="/account/orders">
          <Button variant="ghost" size="sm" className="font-mono text-[11px] uppercase tracking-wider text-[#6f6f6a] hover:text-[#f3f1eb]">
            ← Kembali ke Daftar Pesanan
          </Button>
        </Link>
      </div>
    </div>
  )
}
