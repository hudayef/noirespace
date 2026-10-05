"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-destructive">Terjadi Kesalahan</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Sesuatu Tidak Berjalan Semestinya</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Sistem mengalami kendala tak terduga. Tim kami telah mencatat peristiwa ini.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Coba Lagi</Button>
        <Link href="/">
          <Button variant="outline">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  )
}
