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
      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white">
          <Calendar className="h-4 w-4 text-amber-400" />
          <span>1. Pilih Tanggal Kunjungan</span>
        </div>
        <p className="text-xs text-neutral-400">
          Booking dapat dilakukan minimal H+1 hingga 30 hari ke depan.
        </p>
        <input
          type="date"
          min={minDateStr}
          max={maxDateStr}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          aria-label="Pilih tanggal kunjungan"
          className="w-full rounded-lg border border-white/[0.12] bg-[#09090b] px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-amber-400/60 transition-colors"
        />
      </div>

      {/* Step 2: Time Slot selection */}
      {selectedDate && (
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>2. Pilih Slot Jam</span>
            </div>
            {selectedSlot && (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Slot terpilih
              </span>
            )}
          </div>

          {loading && (
            <div className="py-8 text-center text-sm text-neutral-400 animate-pulse">
              Memeriksa ketersediaan ruangan & instruktur...
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && slots.length === 0 && !error && (
            <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-xs text-neutral-400">
              Tidak ada slot tersedia pada tanggal ini (hari libur atau slot sudah penuh). Silakan pilih tanggal lain.
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
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    !s.available
                      ? "opacity-35 cursor-not-allowed bg-black/40 border-white/[0.04]"
                      : isSelected
                      ? "border-amber-400 bg-amber-400/10 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)] ring-1 ring-amber-400"
                      : "border-white/[0.08] bg-[#09090b] text-neutral-200 hover:border-white/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <p className="font-bold text-sm tracking-tight">
                    {formatTime(s.startTime)} - {formatTime(s.endTime)}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {s.available ? `Tersisa: ${s.remainingCapacity} kuota` : "Penuh"}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: Selection summary & CTA */}
      {selectedSlot && (
        <div className="rounded-xl border border-amber-400/30 bg-gradient-to-b from-[#181613] to-[#121217] p-6 space-y-5 animate-in fade-in duration-200">
          <h3 className="font-bold text-base text-white">Ringkasan Sesi Anda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-y border-white/[0.08] py-4">
            <div>
              <span className="text-neutral-500 uppercase tracking-wider block">Layanan</span>
              <strong className="text-white text-sm">{productName}</strong>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider block">Tanggal</span>
              <strong className="text-white text-sm">{selectedDate}</strong>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-wider block">Jam Sesi</span>
              <strong className="text-amber-300 text-sm">
                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)} WIB
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Total Biaya</span>
              <span className="font-extrabold text-xl text-white">{formatRupiah(productPrice)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="h-11 px-6 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2"
            >
              <span>{addingToCart ? "Memproses..." : "Lanjut ke Pembayaran"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
