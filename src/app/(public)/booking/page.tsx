import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getProductById } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { BookingCalendar } from "@/components/features/booking/booking-calendar"
import { ArrowLeft } from "lucide-react"

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

  const backLink =
    product.type === "studio"
      ? `/studio/${product.slug}`
      : product.type === "education"
      ? `/programs/${product.slug}`
      : `/services/${product.slug}`

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 max-w-3xl space-y-8">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail {product.name}</span>
        </Link>
      </div>

      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Reservasi Jadwal & Sesi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{product.name}</h1>
        <p className="text-sm text-neutral-400">
          Tarif: <strong className="text-white">{formatRupiah(product.price)}</strong> • Durasi: {product.durationMinutes || 60} Menit
        </p>
      </div>

      <BookingCalendar
        productId={product.id}
        productPrice={product.price}
        productName={product.name}
      />
    </div>
  )
}
