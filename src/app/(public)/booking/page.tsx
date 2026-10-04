import { notFound, redirect } from "next/navigation"
import { getProductById } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { BookingCalendar } from "@/components/features/booking/booking-calendar"

interface Props {
  searchParams: Promise<{ productId?: string }>
}

export const metadata = {
  title: "Pilih Jadwal Booking",
  description: "Pilih tanggal dan jam ketersediaan sesi Noire Space.",
}

export default async function BookingPage({ searchParams }: Props) {
  const { productId } = await searchParams

  if (!productId) {
    redirect("/programs")
  }

  const product = await getProductById(productId)
  if (!product || product.status !== "published") {
    notFound()
  }

  return (
    <div className="container py-12 max-w-2xl space-y-8">
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Reservasi & Booking</span>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
        <p className="text-muted-foreground mt-1">Tarif: {formatRupiah(product.price)}</p>
      </div>

      <BookingCalendar
        productId={product.id}
        productPrice={product.price}
        productName={product.name}
      />
    </div>
  )
}
