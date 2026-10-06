"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatTime, formatRupiah } from "@/lib/utils/format"
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"

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
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState("")

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  function handleDateChange(dateValue: string) {
    setSelectedDate(dateValue)
    if (dateValue) {
      setLoading(true)
      setSelectedSlot(null)
      setError("")
    }
  }

  useEffect(() => {
    if (!selectedDate) return
    let active = true

    fetch(`/api/availability?productId=${productId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        if (data.error) setError(data.error)
        else setSlots(data.slots || [])
      })
      .catch(() => {
        if (active) setError("Gagal memuat jadwal ketersediaan")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId, selectedDate])

  async function handleAddToCart() {
    if (!selectedDate || !selectedSlot) return
    setAddingToCart(true)

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          bookingDate: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          quantity: 1,
          price: productPrice,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan slot ke keranjang")
      }

      toast.success("Slot berhasil diamankan dalam keranjang (15 menit). Mengalihkan...")
      router.push("/checkout")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses booking"
      setError(message)
      toast.error(message)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Date selection */}
      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4 rounded-none">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f3f1eb]">
          <Calendar className="h-3.5 w-3.5 text-[#e8e6df]" />
          <span>01 / TANGGAL KUNJUNGAN</span>
        </div>
        <p className="font-mono text-[10px] text-[#6f6f6a]">
          Booking dapat dilakukan minimal H+1 hingga 30 hari ke depan.
        </p>
        <input
          type="date"
          min={minDateStr}
          max={maxDateStr}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          aria-label="Pilih tanggal kunjungan"
          className="w-full border border-[#f3f1eb]/[0.12] bg-[#0a0a0a] px-4 py-3 text-sm font-mono text-[13px] text-[#f3f1eb] focus:outline-none focus:border-[#f3f1eb]/[0.5] transition-colors placeholder:text-[#6f6f6a]/40"
        />
      </div>

      {/* Step 2: Time Slot selection */}
      {selectedDate && (
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4 animate-in fade-in duration-150 rounded-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f3f1eb]">
              <Clock className="h-3.5 w-3.5 text-[#e8e6df]" />
              <span>02 / SLOT JAM</span>
            </div>
            {selectedSlot && (
              <span className="font-mono text-[10px] text-[#f3f1eb] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> SLOT TERPILIH
              </span>
            )}
          </div>

          {loading && (
            <div className="py-8 text-center font-mono text-[11px] text-[#6f6f6a] animate-pulse">
              Memeriksa ketersediaan...
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-[#3a1111] border border-[#6b1e1e] p-3 font-mono text-[10px] text-[#c96] flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && slots.length === 0 && !error && (
            <div className="border border-dashed border-[#f3f1eb]/[0.1] p-6 text-center font-mono text-[10px] text-[#6f6f6a]">
              Tidak ada slot tersedia pada tanggal ini. Silakan pilih tanggal lain.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {slots.map((s, idx) => {
              const isSelected = selectedSlot?.startTime === s.startTime
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s)}
                  className={`p-4 border text-left transition-all relative ${
                    !s.available
                      ? "opacity-35 cursor-not-allowed bg-[#0a0a0a] border-[#f3f1eb]/[0.04]"
                      : isSelected
                      ? "border-[#f3f1eb] bg-[#141414] text-[#f3f1eb] ring-1 ring-[#f3f1eb]"
                      : "border-[#f3f1eb]/[0.08] bg-[#0a0a0a] text-[#e8e6df] hover:border-[#f3f1eb]/[0.3] hover:bg-[#111111]"
                  }`}
                >
                  <p className="font-bold text-sm tracking-tight">
                    {formatTime(s.startTime)} - {formatTime(s.endTime)}
                  </p>
                  <p className="font-mono text-[10px] text-[#6f6f6a] mt-1">
                    {s.available ? `KUOTA: ${s.remainingCapacity}` : "PENUH"}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: Selection summary & CTA */}
      {selectedSlot && (
        <div className="border border-[#f3f1eb]/[0.2] bg-[#111111] p-6 space-y-5 animate-in fade-in duration-150 rounded-none">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3f1eb]">
            03 / RINGKASAN SESI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] border-y border-[#f3f1eb]/[0.08] py-4">
            <div>
              <span className="text-[#6f6f6a] uppercase tracking-wider block">LAYANAN</span>
              <strong className="text-[#f3f1eb] text-sm">{productName}</strong>
            </div>
            <div>
              <span className="text-[#6f6f6a] uppercase tracking-wider block">TANGGAL</span>
              <strong className="text-[#f3f1eb] text-sm">{selectedDate}</strong>
            </div>
            <div>
              <span className="text-[#6f6f6a] uppercase tracking-wider block">JAM SESI</span>
              <strong className="text-[#f3f1eb] text-sm">
                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)} WIB
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f6f6a] block">TOTAL BIAYA</span>
              <span className="font-extrabold text-xl text-[#f3f1eb]">{formatRupiah(productPrice)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="h-11 px-6 font-mono text-[11px] uppercase tracking-[0.18em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none transition-colors flex items-center gap-2"
            >
              <span>{addingToCart ? "MEMPROSES..." : "LANJUT KE PEMBAYARAN"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
