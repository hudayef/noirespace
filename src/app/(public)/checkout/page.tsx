"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatRupiah, formatTime } from "@/lib/utils/format"
import { ShoppingCart, ArrowLeft, Trash2, ArrowRight, ShieldCheck, AlertCircle, Clock } from "lucide-react"

interface CartItem {
  id: string
  productName: string
  productType: string
  bookingDate?: string
  startTime?: string
  endTime?: string
  quantity: number
  price: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const loadCart = useCallback(() => {
    fetch("/api/cart/items")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/checkout")
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        if (data.error) setError(data.error)
        else {
          setItems(data.items || [])
          setSubtotal(data.subtotal || 0)
          if (data.cart?.expiresAt) {
            setExpiresAt(data.cart.expiresAt)
          }
        }
      })
      .catch(() => setError("Gagal memuat keranjang belanja"))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  useEffect(() => {
    if (!expiresAt) return

    function updateTimer() {
      const diff = Math.floor((new Date(expiresAt!).getTime() - Date.now()) / 1000)
      if (diff <= 0) {
        setTimeLeft(0)
        toast.warning("Batas penahanan slot keranjang telah berakhir. Memperbarui status...")
        loadCart()
      } else {
        setTimeLeft(diff)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, loadCart])

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  async function handleRemoveItem(itemId: string) {
    setRemovingId(itemId)
    try {
      const res = await fetch(`/api/cart/items?itemId=${itemId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus item")
      toast.success("Item dihapus dari keranjang.")
      loadCart()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus item"
      toast.error(message)
    } finally {
      setRemovingId(null)
    }
  }

  async function handleCheckout() {
    setProcessing(true)
    setError("")

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan")
      }

      toast.success("Pesanan berhasil dikonfirmasi. Mengalihkan ke pembayaran...")
      router.push(`/checkout/confirmation/${data.order.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses checkout"
      setError(message)
      toast.error(message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center space-y-3">
        <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Memeriksa rincian pesanan Anda...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-md text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingCart className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Keranjang Anda Kosong</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Anda belum memilih jadwal sesi studio atau kelas edukasi Noire Space.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/studio">
            <Button size="sm" className="text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-neutral-200">
              Pesan Studio
            </Button>
          </Link>
          <Link href="/programs">
            <Button size="sm" variant="outline" className="text-xs uppercase tracking-wider border-white/15">
              Program Edukasi
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 max-w-3xl space-y-8">
      <div>
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>TAMBAH JADWAL / SESI LAIN</span>
        </Link>
      </div>

      <div className="space-y-2 border-b border-[#f3f1eb]/[0.08] pb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6a]">
          01 / REVIEW PESANAN
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#f3f1eb] font-normal">
          KERANJANG TRANSAKSI
        </h1>
        <p className="text-xs text-[#6f6f6a]">
          Pastikan jadwal sesi dan rincian waktu sudah sesuai sebelum mengunci transaksi.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-[#3a1111] border border-[#6b1e1e] p-4 font-mono text-xs text-[#c96] flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cart Slot Hold Timer (BR-04: 15 Min Hold) */}
      {timeLeft !== null && timeLeft > 0 && (
        <div className="border border-[#f3f1eb]/[0.2] bg-[#111111] p-4 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#e8e6df] font-mono text-[11px]">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#6f6f6a]" />
            <span>Slot ditahan selama proses checkout.</span>
          </div>
          <span className="font-mono font-medium text-sm tracking-widest text-[#f3f1eb] shrink-0">
            {formatTimer(timeLeft)}
          </span>
        </div>
      )}
      {timeLeft === 0 && (
        <div className="border border-[#6b1e1e] bg-[#1f0d0d] p-4 text-xs text-[#e88] flex items-center justify-between gap-3 font-mono">
          <span>Waktu penahanan slot habis. Silakan pilih ulang jadwal sesi Anda.</span>
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            size="sm"
            className="text-[10px] uppercase font-bold border-[#6b1e1e] text-[#e88] hover:bg-[#3a1111] rounded-none"
          >
            Muat Ulang
          </Button>
        </div>
      )}

      {/* Cart Items List */}
      <div className="border border-[#f3f1eb]/[0.1] divide-y divide-[#f3f1eb]/[0.08] bg-[#111111]">
        {items.map((item) => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[#f3f1eb]/[0.1] text-[#6f6f6a]">
                {item.productType}
              </span>
              <h2 className="font-display text-lg sm:text-xl text-[#f3f1eb] font-normal">{item.productName}</h2>
              {item.bookingDate && item.startTime && item.endTime && (
                <p className="font-mono text-xs text-[#e8e6df]">
                  {item.bookingDate} · {formatTime(item.startTime)} - {formatTime(item.endTime)} WIB
                </p>
              )}
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
              <div className="text-right">
                <p className="font-mono font-bold text-base text-[#f3f1eb]">{formatRupiah(item.price * item.quantity)}</p>
                {item.quantity > 1 && (
                  <span className="font-mono text-[10px] text-[#6f6f6a]">{item.quantity}x @ {formatRupiah(item.price)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={removingId === item.id}
                aria-label="Hapus item ini"
                className="text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary Card */}
      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-baseline font-mono border-b border-[#f3f1eb]/[0.08] pb-4">
          <span className="text-[#6f6f6a] text-xs uppercase tracking-widest">TOTAL PEMBAYARAN</span>
          <span className="text-2xl font-bold text-[#f3f1eb]">{formatRupiah(subtotal)}</span>
        </div>

        <div className="border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] p-4 font-mono text-[11px] text-[#6f6f6a] space-y-1.5">
          <p className="text-[#e8e6df] font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#e8e6df]" />
            <span>KEBIJAKAN TRANSAKSI NOIRE SPACE:</span>
          </p>
          <p>• Transaksi bersifat non-refundable (tidak dapat dicairkan kembali).</p>
          <p>• Reschedule jadwal sesi dapat diajukan mandiri maksimal 24 jam sebelum jadwal sesi.</p>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full h-12 font-mono text-[11px] uppercase tracking-[0.2em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] flex items-center justify-center gap-2 rounded-none transition-colors"
        >
          <span>{processing ? "MEMPROSES PESANAN..." : "KONFIRMASI & LANJUT PEMBAYARAN"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
