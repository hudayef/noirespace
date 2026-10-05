import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Tentang Kami — Noire Space",
  description: "Mengenal ekosistem teknologi kreatif dan studio Noire Space.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 space-y-16 max-w-4xl">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Our Vision & Philosophy</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          LEARN. CREATE. EARN.
        </h1>
        <p className="text-lg text-neutral-300 leading-relaxed">
          Noire Space adalah <strong className="text-white font-semibold">creative technology ecosystem</strong> yang didirikan untuk mempercepat pertumbuhan kreator muda melalui penguasaan teknologi visual, kecerdasan buatan, dan kemandirian berkarya secara komersial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold font-mono">01. Learn</span>
          <h2 className="text-xl font-bold text-white">Edukasi Berbasis Praktik</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Kurikulum intensif dimentori oleh praktisi aktif industri komersial modern, fokus pada portfolio riil dan workflow efisien.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold font-mono">02. Create</span>
          <h2 className="text-xl font-bold text-white">Fasilitas Standar Industri</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Akses ke studio tata cahaya terkalibrasi, lighting Godox & Aputure, multi-backdrop, dan tools kecerdasan buatan terkini.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-3">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">03. Earn</span>
          <h2 className="text-xl font-bold text-white">Komersialisasi Karya</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Menghubungkan karya kreator muda langsung dengan kebutuhan brand, UMKM, dan peluang monetisasi digital nyata.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#141419] to-[#0c0c10] p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Siap berkolaborasi atau memesan sesi?</h3>
          <p className="text-xs text-neutral-400">Jadwalkan rental studio atau daftarkan diri Anda di program edukasi kami.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/studio">
            <Button size="sm" className="h-10 px-5 text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
              Pesan Studio
            </Button>
          </Link>
          <Link href="/programs">
            <Button size="sm" variant="outline" className="h-10 px-5 text-xs uppercase tracking-wider border-white/20 text-neutral-200 hover:text-white">
              Lihat Program
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
