"use client"

import { Printer, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderConfirmationActionsProps {
  orderNumber: string
  totalText: string
  customerName?: string
  orderStatus: string
  paymentUrl?: string
}

export function OrderConfirmationActions({
  orderNumber,
  totalText,
  customerName,
  orderStatus,
  paymentUrl,
}: OrderConfirmationActionsProps) {
  const isAwaitingPayment = ["pending", "awaiting_payment"].includes(orderStatus)

  const handlePrint = () => {
    window.print()
  }

  const waMessage = encodeURIComponent(
    `Halo Tim Concierge Noire Space, saya ingin konfirmasi pesanan:\n` +
      `- No. Pesanan: #${orderNumber}\n` +
      `- Nama: ${customerName || "Pelanggan"}\n` +
      `- Total: ${totalText}\n` +
      `- Status: ${orderStatus.toUpperCase()}\n\n` +
      `Mohon informasinya terkait persiapan sesi. Terima kasih!`
  )

  const waUrl = `https://wa.me/6288212343431?text=${waMessage}`

  return (
    <div className="space-y-4 pt-2 print:hidden">
      <div className="flex flex-col sm:flex-row gap-3">
        {isAwaitingPayment && paymentUrl && (
          <a href={paymentUrl} className="flex-1">
            <Button size="lg" className="w-full h-12 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200">
              Bayar Sekarang ↗
            </Button>
          </a>
        )}

        <Button
          type="button"
          onClick={handlePrint}
          variant="outline"
          className="flex-1 h-12 text-xs uppercase tracking-widest font-semibold border-white/[0.12] text-neutral-200 hover:text-white hover:bg-white/[0.06] flex items-center justify-center gap-2"
        >
          <Printer className="h-4 w-4 text-amber-400" />
          <span>Cetak / Simpan Invoice</span>
        </Button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-xs uppercase tracking-widest font-semibold border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Chat Admin</span>
          </Button>
        </a>
      </div>
    </div>
  )
}
