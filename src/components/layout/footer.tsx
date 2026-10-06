import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#f3f1eb]/[0.08] bg-[#0a0a0a] text-[#f3f1eb]">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#f3f1eb]/[0.08]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#6f6f6a]">INDEX /</span>
              <span className="font-display text-2xl tracking-[0.16em] text-[#f3f1eb]">
                NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6f6f6a] max-w-sm leading-relaxed">
              Creative technology ecosystem combining calibrated studio spaces, project-led incubation, and commercial production services.
            </p>
            <div className="pt-2">
              <p className="font-mono text-[10px] tracking-[0.22em] text-[#e8e6df]">
                LEARN · CREATE · EARN
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">
              01 / Ekosistem
            </p>
            <nav className="flex flex-col gap-2.5 text-xs text-[#e8e6df]">
              <Link href="/programs" className="hover:text-[#f3f1eb] transition-colors">Program Edukasi</Link>
              <Link href="/studio" className="hover:text-[#f3f1eb] transition-colors">Studio Experience</Link>
              <Link href="/services" className="hover:text-[#f3f1eb] transition-colors">Layanan Kreatif</Link>
              <Link href="/school" className="hover:text-[#f3f1eb] transition-colors">Kemitraan Sekolah</Link>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">
              02 / Informasi
            </p>
            <nav className="flex flex-col gap-2.5 text-xs text-[#e8e6df]">
              <Link href="/about" className="hover:text-[#f3f1eb] transition-colors">Tentang Kami</Link>
              <Link href="/faq" className="hover:text-[#f3f1eb] transition-colors">Tanya Jawab</Link>
              <Link href="/contact" className="hover:text-[#f3f1eb] transition-colors">Kontak Studio</Link>
            </nav>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">
              03 / Legalitas
            </p>
            <nav className="flex flex-col gap-2.5 text-xs text-[#e8e6df]">
              <Link href="/terms" className="hover:text-[#f3f1eb] transition-colors">Syarat & Ketentuan</Link>
              <Link href="/privacy" className="hover:text-[#f3f1eb] transition-colors">Kebijakan Privasi</Link>
              <div className="pt-2 border-t border-[#f3f1eb]/[0.06]">
                <span className="font-mono text-[10px] tracking-wider text-[#6f6f6a] block uppercase">
                  Ketentuan Transaksi:
                </span>
                <span className="font-mono text-[10px] text-[#e8e6df] block mt-0.5">
                  Paid bookings are strictly non-refundable.
                </span>
              </div>
            </nav>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f6f6a]">
          <p>&copy; {new Date().getFullYear()} Noire Space. All rights reserved.</p>
          <p>BOGOR / INDONESIA · STUDIO & CREATIVE TECHNOLOGY</p>
        </div>
      </div>
    </footer>
  )
}
