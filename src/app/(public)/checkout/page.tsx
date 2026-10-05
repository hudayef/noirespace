"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatRupiah, formatTime } from "@/lib/utils/format"
import { ShoppingCart, ArrowLeft, Trash2, ArrowRight, ShieldCheck, AlertCircle, Clock, AlertTriangle } from "lucide-react"

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
    <div className="container mx-auto px-6 lg:px-12 py-12 max-w-3xl space-y-8">
      <div>
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tambah Jadwal / Sesi Lain</span>
        </Link>
      </div>

      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Review Pesanan Anda</h1>
        <p className="text-xs text-neutral-400">
          Pastikan jadwal sesi dan rincian waktu sudah sesuai sebelum mengunci transaksi.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cart Slot Hold Timer (BR-04: 15 Min Hold) */}
      {timeLeft !== null && timeLeft > 0 && (
        <div className={`rounded-xl border p-4 text-xs flex items-center justify-between gap-3 transition-colors ${
          timeLeft < 60
            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        }`}>
          <div className="flex items-center gap-2.5 font-medium">
            {timeLeft < 60 ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <Clock className="h-4 w-4 shrink-0" />}
            <span>Slot ditahan sementara selama proses checkout Anda.</span>
          </div>
          <span className="font-mono font-bold text-base tracking-widest shrink-0">
            {formatTimer(timeLeft)}
          </span>
        </div>
      )}
      {timeLeft === 0 && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-center justify-between gap-3">
          <span>Waktu penahanan slot habis. Silakan pilih ulang jadwal sesi Anda.</span>
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            size="sm"
            className="text-[10px] uppercase font-bold border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
          >
            Muat Ulang
          </Button>
        </div>
      )}

      {/* Cart Items List */}
      <div className="rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] bg-[#121217]">
        {items.map((item) => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300 font-semibold">
                {item.productType}
              </span>
              <h2 className="font-bold text-base text-white">{item.productName}</h2>
              {item.bookingDate && item.startTime && item.endTime && (
                <p className="text-xs text-amber-300 font-medium">
                  {item.bookingDate} ({formatTime(item.startTime)} - {formatTime(item.endTime)} WIB)
                </p>
              )}
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
              <div className="text-right">
                <p className="font-extrabold text-base text-white">{formatRupiah(item.price * item.quantity)}</p>
                {item.quantity > 1 && (
                  <span className="text-[11px] text-neutral-400">{item.quantity}x @ {formatRupiah(item.price)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={removingId === item.id}
                aria-label="Hapus item ini"
                className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary Card */}
      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex justify-between items-center text-lg font-bold border-b border-white/[0.08] pb-4">
          <span className="text-neutral-300 text-sm uppercase tracking-wider">Total Pembayaran</span>
          <span className="text-2xl font-extrabold text-white">{formatRupiah(subtotal)}</span>
        </div>

        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 text-xs text-neutral-400 space-y-1.5">
          <p className="font-bold text-neutral-200 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Kebijakan Transaksi Noire Space:</span>
          </p>
          <p>• Transaksi bersifat non-refundable (tidak dapat dicairkan kembali).</p>
          <p>• Reschedule jadwal sesi dapat diajukan mandiri maksimal 24 jam sebelum jadwal sesi.</p>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full h-12 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
        >
          <span>{processing ? "Memproses Pesanan..." : "Konfirmasi & Lanjut Pembayaran"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
