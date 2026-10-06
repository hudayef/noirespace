import Link from "next/link"
import { SectionLabel } from "@/components/editorial"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Tentang Kami — Noire Space",
  description: "Mengenal ekosistem teknologi kreatif dan studio Noire Space.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16 max-w-4xl">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="space-y-4">
        <SectionLabel number="01" label="OUR PHILOSOPHY" />
        <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-[#f3f1eb] leading-tight">
          LEARN · CREATE · EARN
        </h1>
        <p className="text-base sm:text-lg text-[#6f6f6a] leading-relaxed">
          Noire Space adalah <strong className="text-[#f3f1eb] font-normal">creative technology ecosystem</strong> yang didirikan untuk mempercepat pertumbuhan kreator visual muda melalui fasilitas studio berstandar industri, pembelajaran berbasis proyek komersial nyata, dan monetisasi karya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#6f6f6a]">01 / LEARN</span>
          <h2 className="font-display text-xl text-[#f3f1eb] font-normal font-sans">Edukasi Berbasis Praktik</h2>
          <p className="text-xs text-[#6f6f6a] leading-relaxed font-sans">
            Kurikulum intensif dimentori oleh praktisi aktif industri komersial modern, fokus langsung pada portfolio riil dan workflow efisien.
          </p>
        </div>

        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#6f6f6a]">02 / CREATE</span>
          <h2 className="font-display text-xl text-[#f3f1eb] font-normal font-sans">Fasilitas Terkalibrasi</h2>
          <p className="text-xs text-[#6f6f6a] leading-relaxed font-sans">
            Akses ke studio tata cahaya profesional, continuous video lighting, seamless backdrops, dan workflow generative kreatif terkini.
          </p>
        </div>

        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#6f6f6a]">03 / EARN</span>
          <h2 className="font-display text-xl text-[#f3f1eb] font-normal font-sans">Komersialisasi Karya</h2>
          <p className="text-xs text-[#6f6f6a] leading-relaxed font-sans">
            Menghubungkan karya talenta muda langsung dengan kebutuhan brand, UMKM, dan peluang monetisasi karya secara nyata.
          </p>
        </div>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 lg:p-10 flex flex-col sm:flex-row items-baseline justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display text-xl text-[#f3f1eb] font-normal">Siap berkolaborasi atau memesan sesi?</h3>
          <p className="text-xs text-[#6f6f6a]">Jadwalkan rental studio atau daftarkan diri Anda di program edukasi kami.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/studio"
            className="font-mono text-[11px] uppercase tracking-wider bg-[#f3f1eb] text-[#0a0a0a] px-5 py-2.5 hover:bg-[#e8e6df] font-medium transition-colors"
          >
            Pesan Studio
          </Link>
          <Link
            href="/programs"
            className="font-mono text-[11px] uppercase tracking-wider border border-[#f3f1eb]/[0.15] text-[#e8e6df] px-5 py-2.5 hover:text-[#f3f1eb] hover:bg-[#171717] transition-colors"
          >
            Lihat Program
          </Link>
        </div>
      </div>
    </div>
  )
}
