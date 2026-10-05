import Link from "next/link"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export const metadata = {
  title: "Program Edukasi & Inkubasi Kreatif — Noire Space",
  description: "Program creative technology education Noire Space untuk generasi muda dan kreator digital.",
}

export default async function ProgramsPage() {
  const items = await getProducts({ type: "education", status: "published" })

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <span className="text-[11px] uppercase tracking-[0.25em] text-indigo-400 font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span>Curriculum & Cohorts</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">PROGRAM EDUKASI</h1>
        <p className="text-base text-neutral-300 leading-relaxed">
          Kembangkan keahlian kreatif dan teknologi masa depan melalui silabus berbasis proyek riil: AI tools, visual branding, dan teknik sinematografi praktis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-neutral-500 col-span-full py-12 text-center text-sm">Belum ada program edukasi yang dipublikasikan.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-7 flex flex-col justify-between hover:border-indigo-400/40 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold">
                    Creative Cohort
                  </span>
                  <span className="text-neutral-500 group-hover:text-indigo-300 transition-colors">↗</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">{item.name}</h2>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {item.shortDescription || item.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
                  {item.durationMinutes && <span>⏱ {item.durationMinutes} menit</span>}
                  {item.capacity && <span>👥 Kuota: {item.capacity} siswa</span>}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Biaya Registrasi</span>
                  <span className="font-extrabold text-lg text-white">
                    {item.price === 0 ? "Gratis" : formatRupiah(item.price)}
                  </span>
                </div>
                <Link href={`/programs/${item.slug}`}>
                  <Button size="sm" className="text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
                    Lihat Program
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
