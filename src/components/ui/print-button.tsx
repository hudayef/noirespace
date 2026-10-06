"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      variant="outline"
      className="h-9 font-mono text-[10px] uppercase tracking-widest font-medium border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-2"
    >
      <Printer className="h-3.5 w-3.5 text-[#6f6f6a]" />
      <span>Cetak / Simpan PDF</span>
    </Button>
  )
}
