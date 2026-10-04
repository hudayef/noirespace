import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-widest mb-4">NOIRE SPACE</h3>
            <p className="text-sm text-muted-foreground">Learn. Create. Earn.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Layanan</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/programs" className="hover:text-foreground transition-colors">Program</Link>
              <Link href="/studio" className="hover:text-foreground transition-colors">Studio</Link>
              <Link href="/services" className="hover:text-foreground transition-colors">Layanan</Link>
              <Link href="/school" className="hover:text-foreground transition-colors">Sekolah</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Informasi</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">Tentang Kami</Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Kontak</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">Syarat & Ketentuan</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Noire Space. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
