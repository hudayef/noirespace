"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      variant="outline"
      className="h-10 text-xs uppercase tracking-widest font-semibold border-white/[0.12] text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2"
    >
      <Printer className="h-4 w-4 text-amber-400" />
      <span>Cetak / Simpan PDF</span>
    </Button>
  )
}
