"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteProductButtonProps {
  productId: string
  productName: string
  onDelete: (id: string) => Promise<void>
}

export function DeleteProductButton({ productId, productName, onDelete }: DeleteProductButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onDelete(productId)
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
        <Button
          size="xs"
          variant="destructive"
          disabled={loading}
          onClick={handleConfirm}
          className="text-[10px] font-bold"
        >
          {loading ? "..." : "Ya, Hapus"}
        </Button>
        <Button
          size="xs"
          variant="ghost"
          disabled={loading}
          onClick={() => setConfirming(false)}
          className="text-[10px]"
        >
          Batal
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={() => setConfirming(true)}
      aria-label={`Hapus produk ${productName}`}
      className="text-[#6f6f6a] hover:text-[#e88] hover:bg-[#1f0d0d] text-xs"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
