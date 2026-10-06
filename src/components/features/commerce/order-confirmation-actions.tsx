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
            <Button size="lg" className="w-full h-11 text-[11px] uppercase tracking-[0.18em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none">
              Bayar Sekarang ↗
            </Button>
          </a>
        )}

        <Button
          type="button"
          onClick={handlePrint}
          variant="outline"
          className="flex-1 h-11 text-[11px] uppercase tracking-[0.18em] font-medium border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center justify-center gap-2"
        >
          <Printer className="h-3.5 w-3.5 text-[#6f6f6a]" />
          <span>Cetak Invoice</span>
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
            className="w-full h-11 text-[11px] uppercase tracking-[0.18em] font-medium border-[#f3f1eb]/[0.15] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#6f6f6a]" />
            <span>Chat Admin</span>
          </Button>
        </a>
      </div>
    </div>
  )
}
