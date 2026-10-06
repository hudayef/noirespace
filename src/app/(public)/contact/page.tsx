import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/editorial"
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
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12 max-w-4xl">
      <div className="space-y-4">
        <SectionLabel number="01" label="CONCIERGE & SUPPORT" />
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#f3f1eb]">HUBUNGI KAMI</h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] max-w-2xl leading-relaxed">
          Punya pertanyaan seputar ketersediaan studio, kurikulum edukasi, penawaran B2B sekolah, atau asistensi teknis? Tim kami siap merespons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Studio Location Card */}
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 space-y-5">
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-[#e8e6df]" />
            <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Studio & Creative Hub</h2>
          </div>
          <div className="space-y-3 text-xs text-[#6f6f6a] font-mono">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-[#6f6f6a] shrink-0 mt-0.5" />
              <span className="text-[#e8e6df]">Jl. Puricitayam Permai, Citayam, Bogor</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="h-3.5 w-3.5 text-[#6f6f6a] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#e8e6df]">Senin – Sabtu: 09:00 – 18:00 WIB</p>
                <p className="text-[#6f6f6a] mt-0.5">Minggu: Khusus reservasi terkonfirmasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Card */}
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 space-y-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-[#e8e6df]" />
            <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Kanal Komunikasi</h2>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <a
              href="mailto:noirespace.one@gmail.com"
              className="flex items-center gap-2.5 text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-[#6f6f6a] shrink-0" />
              <span>noirespace.one@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/noirespace.official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#6f6f6a] shrink-0" />
              <span>@noirespace.official</span>
            </a>
            <div className="pt-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-11 font-mono text-[11px] uppercase tracking-[0.16em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none flex items-center justify-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Chat WhatsApp Langsung</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Links Strip */}
      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#f3f1eb]">Tanya Jawab (FAQ)</h3>
          <p className="text-xs text-[#6f6f6a] mt-0.5">Pelajari syarat pemesanan, kebijakan reschedule, dan ketentuan alat studio.</p>
        </div>
        <Link href="/faq">
          <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] rounded-none flex items-center gap-1.5">
            <span>Buka FAQ</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
