import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] text-white">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block text-xl font-extrabold tracking-[0.25em]">
              NOIRE<span className="text-white/40 font-light">SPACE</span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Creative technology ecosystem yang menggabungkan edukasi modern, studio produksi berstandar industri, dan inkubasi kreator muda generasi baru.
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold pt-2">
              LEARN. CREATE. EARN.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-neutral-300">Ekosistem</h4>
            <nav className="flex flex-col gap-3 text-sm text-neutral-400">
              <Link href="/programs" className="hover:text-white transition-colors">Program Edukasi</Link>
              <Link href="/studio" className="hover:text-white transition-colors">Studio Experience</Link>
              <Link href="/services" className="hover:text-white transition-colors">Layanan Kreatif & AI</Link>
              <Link href="/school" className="hover:text-white transition-colors">Kemitraan Sekolah</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-neutral-300">Informasi</h4>
            <nav className="flex flex-col gap-3 text-sm text-neutral-400">
              <Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
              <Link href="/faq" className="hover:text-white transition-colors">Pertanyaan Umum (FAQ)</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Kontak Studio</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-neutral-300">Legalitas</h4>
            <nav className="flex flex-col gap-3 text-sm text-neutral-400">
              <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <span className="text-xs text-neutral-500 mt-2 block">Non-Refund Policy Enforced</span>
            </nav>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Noire Space. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Studio Photography & Creative Tech</p>
        </div>
      </div>
    </footer>
  )
}
