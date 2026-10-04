"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils/format"

interface Slot {
  startTime: string
  endTime: string
  available: boolean
  remainingCapacity: number
  totalCapacity: number
}

interface BookingCalendarProps {
  productId: string
  productPrice: number
  productName: string
}

export function BookingCalendar({ productId, productPrice, productName }: BookingCalendarProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  useEffect(() => {
    if (!selectedDate) return
    setLoading(true)
    setSelectedSlot(null)
    setError("")

    fetch(`/api/availability?productId=${productId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setSlots(data.slots || [])
      })
      .catch(() => setError("Gagal memuat jadwal"))
      .finally(() => setLoading(false))
  }, [productId, selectedDate])

  async function handleAddToCart() {
    if (!selectedDate || !selectedSlot) return
    setLoading(true)

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          bookingDate: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          price: productPrice,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal memasukkan ke keranjang")
      }

      router.push("/checkout")
    } catch (err: any) {
      setError(err.message || "Gagal memproses booking")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-semibold">1. Pilih Tanggal</label>
        <input
          type="date"
          min={minDateStr}
          max={maxDateStr}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <label className="text-sm font-semibold">2. Pilih Slot Jam Tersedia</label>
          {loading && <p className="text-sm text-muted-foreground">Memeriksa ketersediaan...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && slots.length === 0 && (
            <p className="text-sm text-muted-foreground">Tidak ada slot tersedia pada tanggal ini.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slots.map((s, idx) => {
              const isSelected = selectedSlot?.startTime === s.startTime
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    !s.available
                      ? "opacity-40 cursor-not-allowed bg-muted"
                      : isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "hover:border-foreground/50"
                  }`}
                >
                  <p className="font-bold text-sm">
                    {formatTime(s.startTime)} - {formatTime(s.endTime)}
                  </p>
                  <p className="text-xs opacity-80 mt-1">
                    {s.available ? `Sisa: ${s.remainingCapacity} kuota` : "Penuh"}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className="rounded-lg border p-6 space-y-4 bg-card">
          <h3 className="font-bold">Ringkasan Pilihan</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Layanan: <strong className="text-foreground">{productName}</strong></p>
            <p>Tanggal: <strong className="text-foreground">{selectedDate}</strong></p>
            <p>Waktu: <strong className="text-foreground">{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</strong></p>
          </div>
          <Button onClick={handleAddToCart} disabled={loading} className="w-full" size="lg">
            {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
          </Button>
        </div>
      )}
    </div>
  )
}
