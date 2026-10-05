import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, MessageSquare, Mail, MapPin, Clock, ArrowRight, Globe } from "lucide-react"

export const metadata = {
  title: "Hubungi Kami — Noire Space",
  description: "Kontak, konsultasi langsung via WhatsApp, dan lokasi studio Noire Space.",
}

export default function ContactPage() {
  const waMessage = encodeURIComponent(
    "Halo Concierge Noire Space, saya ingin konsultasi mengenai layanan studio / program edukasi."
  )
  const waUrl = `https://wa.me/6288212343431?text=${waMessage}`

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 space-y-12 max-w-4xl">
      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Concierge & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">HUBUNGI KAMI</h1>
        <p className="text-base text-neutral-300 max-w-2xl leading-relaxed">
          Punya pertanyaan seputar ketersediaan studio, workshop edukasi, penawaran B2B sekolah, atau asistensi teknis? Tim kami siap membantu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Studio Location Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-8 space-y-5">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Studio & Creative Hub</h2>
          </div>
          <div className="space-y-3 text-xs text-neutral-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>Jl. Puricitayam Permai, Rawapanjang, Citayam</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p>Senin – Sabtu: 09:00 – 18:00 WIB</p>
                <p className="text-neutral-500 mt-0.5">Minggu & Libur Nasional: Khusus reservasi terkonfirmasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-8 space-y-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Kanal Komunikasi Cepat</h2>
          </div>
          <div className="space-y-3 text-xs text-neutral-300">
            <a
              href="mailto:noirespace.one@gmail.com"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
              <span>noirespace.one@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/noirespace.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4 text-neutral-400 shrink-0" />
              <span>@noirespace.official</span>
            </a>
            <div className="pt-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-11 text-xs uppercase tracking-widest font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat WhatsApp Langsung</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Links Strip */}
      <div className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#141419] to-[#0c0c10] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-white">Pertanyaan Sering Diajukan (FAQ)</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Pelajari syarat pemesanan, kebijakan reschedule, dan ketentuan alat studio.</p>
        </div>
        <Link href="/faq">
          <Button variant="outline" size="sm" className="text-xs uppercase tracking-wider font-semibold border-white/15 text-neutral-200 hover:text-white flex items-center gap-1.5">
            <span>Buka Halaman FAQ</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
