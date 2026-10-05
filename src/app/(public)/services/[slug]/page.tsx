import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { BookingCalendar } from "@/components/features/booking/booking-calendar"
import { ArrowLeft, Check, Layers } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Layanan Tidak Ditemukan" }
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status !== "published") {
    notFound()
  }

  const includes = (product.includes as string[]) || []

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 space-y-8">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog Layanan</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-400 font-semibold">
              Layanan Kreatif Komersial
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">{product.name}</h1>
          </div>

          <div>
            <p className="text-base text-neutral-300 leading-relaxed whitespace-pre-line">
              {product.description || product.shortDescription}
            </p>
          </div>

          {includes.length > 0 && (
            <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Cakupan Layanan:</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-300">
                {includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="h-4 w-4 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* In-place Booking Section */}
          <div id="booking-section" className="space-y-4 pt-6 border-t border-white/[0.08] scroll-mt-28">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-400 font-semibold">
                Jadwalkan Sesi Produksi Langsung
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Reservasi Jadwal Pra-Produksi</h2>
              <p className="text-xs text-neutral-400">Pilih tanggal dan slot jam pengerjaan atau konsultasi sesi produksi Anda.</p>
            </div>
            <BookingCalendar
              productId={product.id}
              productPrice={product.price}
              productName={product.name}
            />
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-6 sticky top-28 shadow-xl">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">Tarif Mulai</span>
              <span className="text-3xl font-extrabold text-white mt-1 block">{formatRupiah(product.price)}</span>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 border-y border-white/[0.08] py-4">
              {product.durationMinutes && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Estimasi Pengerjaan</span>
                  <span className="font-bold text-white">{product.durationMinutes} Menit</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Format Output</span>
                <span className="font-bold text-white">Digital High-Res</span>
              </div>
            </div>

            <a href="#booking-section" className="block">
              <Button size="lg" className="w-full h-12 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.12)]">
                Pesan & Pilih Jadwal ↓
              </Button>
            </a>

            <p className="text-[11px] text-center text-neutral-500 leading-normal">
              Konsultasi pra-produksi dapat dilakukan bersama tim setelah pesanan dikonfirmasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
