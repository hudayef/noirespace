"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatRupiah, formatTime } from "@/lib/utils/format"

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
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
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
        }
      })
      .catch(() => setError("Gagal memuat keranjang belanja"))
      .finally(() => setLoading(false))
  }, [router])

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

      router.push(`/checkout/confirmation/${data.order.id}`)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Memuat rincian pesanan...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="text-muted-foreground text-sm">
          Pilih salah satu program atau sesi studio terlebih dahulu.
        </p>
        <Button onClick={() => router.push("/programs")}>Jelajahi Layanan</Button>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout Pesanan</h1>
        <p className="text-muted-foreground text-sm mt-1">Periksa kembali detail jadwal sebelum melanjutkan ke pembayaran.</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      <div className="rounded-lg border divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{item.productType}</span>
              <h2 className="font-bold text-lg">{item.productName}</h2>
              {item.bookingDate && item.startTime && item.endTime && (
                <p className="text-xs text-muted-foreground">
                  Jadwal: {item.bookingDate} ({formatTime(item.startTime)} - {formatTime(item.endTime)})
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold">{formatRupiah(item.price * item.quantity)}</p>
              {item.quantity > 1 && <span className="text-xs text-muted-foreground">{item.quantity} x {formatRupiah(item.price)}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Pembayaran</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>

        <div className="rounded-md bg-muted p-4 text-xs space-y-1 text-muted-foreground">
          <p className="font-semibold text-foreground">Kebijakan Pembayaran Noire Space:</p>
          <p>- Seluruh transaksi bersifat non-refundable (tidak dapat diuangkan kembali).</p>
          <p>- Reschedule jadwal diizinkan maksimal 24 jam sebelum waktu sesi dimulai.</p>
        </div>

        <Button onClick={handleCheckout} disabled={processing} className="w-full" size="lg">
          {processing ? "Memproses Pesanan..." : "Konfirmasi & Lanjut Pembayaran"}
        </Button>
      </div>
    </div>
  )
}
