import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Noire Space</p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Halaman yang kamu cari tidak ditemukan. Mungkin sudah dipindahkan atau belum tersedia.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
        <Link href="/programs">
          <Button variant="outline">Lihat Program</Button>
        </Link>
      </div>
    </div>
  )
}
