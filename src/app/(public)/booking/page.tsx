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
    <div className="container mx-auto px-6 lg:px-12 py-16 max-w-3xl space-y-8">
      {/* Contextual Back Navigation */}
      <div>
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Detail {product.name}</span>
        </Link>
      </div>

      <div className="space-y-3 border-b border-[#f3f1eb]/[0.08] pb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6f6f6a]">
          RESERVASI JADWAL & SESI
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#f3f1eb] font-normal">{product.name}</h1>
        <p className="font-mono text-xs text-[#6f6f6a]">
          Tarif: <strong className="text-[#f3f1eb] font-normal">{formatRupiah(product.price)}</strong> · Durasi: {product.durationMinutes || 60} Menit
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
