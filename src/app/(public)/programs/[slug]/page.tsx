import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { BookingCalendar } from "@/components/features/booking/booking-calendar"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Program Tidak Ditemukan" }
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status !== "published") {
    notFound()
  }

  const includes = (product.includes as string[]) || []
  const requirements = (product.requirements as string[]) || []

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
      <div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Katalog Program</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6f6f6a]">
              SPECIMEN / PROGRAM EDUKASI
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#f3f1eb] leading-tight">{product.name}</h1>
          </div>

          <div className="border-t border-[#f3f1eb]/[0.08] pt-6">
            <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription}
            </p>
          </div>

          {includes.length > 0 && (
            <div className="space-y-4 border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#f3f1eb]">
                MATERI & FASILITAS:
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-[#e8e6df]">
                {includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#6f6f6a]">―</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="space-y-4 border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[#f3f1eb]">PERSYARATAN:</h2>
              <ul className="space-y-2 font-mono text-xs text-[#6f6f6a]">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 sm:p-8 space-y-6 sticky top-28">
            <div className="border-b border-[#f3f1eb]/[0.08] pb-4 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#6f6f6a] block">Biaya Registrasi</span>
              <span className="font-mono text-2xl font-bold text-[#f3f1eb]">
                {product.price === 0 ? "Gratis" : formatRupiah(product.price)}
              </span>
              {product.capacity && (
                <span className="font-mono text-xs text-[#6f6f6a] block">Kuota Maksimal: {product.capacity} Siswa</span>
              )}
            </div>

            <BookingCalendar
              productId={product.id}
              productPrice={product.price}
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
