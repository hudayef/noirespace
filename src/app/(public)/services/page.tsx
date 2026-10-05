import Link from "next/link"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Layers } from "lucide-react"

export const metadata = {
  title: "Layanan Kreatif Komersial — Noire Space",
  description: "Layanan fotografi produk, portofolio, dan produksi konten digital komersial di Noire Space Jakarta.",
}

export default async function ServicesPage() {
  const items = await getProducts({ type: "service", status: "published" })

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-400 font-semibold flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Commercial Production</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">LAYANAN KREATIF</h1>
        <p className="text-base text-neutral-300 leading-relaxed">
          Solusi produksi visual terpadu mulai dari fotografi komersial, lookbook fashion, editing AI generative, hingga manajemen konten kreatif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-neutral-500 col-span-full py-12 text-center text-sm">Belum ada layanan yang dipublikasikan.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-7 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold">
                    Creative Service
                  </span>
                  <span className="text-neutral-500 group-hover:text-cyan-300 transition-colors">↗</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">{item.name}</h2>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {item.shortDescription || item.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
                  {item.durationMinutes && <span>⏱ Estimasi: {item.durationMinutes} menit</span>}
                  <span>📁 Output: High-Res Digital</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Tarif Mulai</span>
                  <span className="font-extrabold text-lg text-white">{formatRupiah(item.price)}</span>
                </div>
                <Link href={`/services/${item.slug}`}>
                  <Button size="sm" className="text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
                    Pesan Layanan
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
