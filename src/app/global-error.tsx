"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-black text-white">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">NOIRE SPACE</p>
          <h1 className="text-4xl font-bold">Terjadi Kesalahan Sistem</h1>
          <p className="text-white/70 max-w-md mx-auto text-sm">
            Kendala kritis pada server. Silakan muat ulang halaman.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => reset()} variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            Coba Lagi
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Beranda
            </Button>
          </Link>
        </div>
      </body>
    </html>
  )
}
