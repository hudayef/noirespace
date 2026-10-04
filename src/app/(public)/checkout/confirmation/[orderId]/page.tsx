import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/modules/auth"
import { getOrderById } from "@/lib/modules/commerce/order.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

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

  return (
    <div className="container py-12 max-w-2xl space-y-8">
      <div className="rounded-lg border bg-card p-8 text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background font-bold text-xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pesanan Berhasil Dibuat</h1>
        <p className="text-muted-foreground text-sm">
          Nomor Pesanan: <span className="font-mono font-bold text-foreground">{order.orderNumber}</span>
        </p>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-bold text-lg">Rincian Pembayaran</h2>
        <div className="divide-y text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <span>{item.description} ({item.quantity}x)</span>
              <span className="font-medium">{formatRupiah(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>{formatRupiah(order.total)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Status Pembayaran</span>
          <span className="uppercase font-semibold text-foreground">{order.status}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/api/payment/create?orderId=${order.id}`} className="flex-1">
          <Button size="lg" className="w-full">
            Bayar via Midtrans
          </Button>
        </Link>
        <Link href="/account/orders" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            Lihat Pesanan Saya
          </Button>
        </Link>
      </div>
    </div>
  )
}
