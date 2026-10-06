"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatTime, formatRupiah } from "@/lib/utils/format"
import { ArrowLeft, AlertCircle, RotateCcw } from "lucide-react"
import { AddToCalendar } from "@/components/features/booking/add-to-calendar"

interface Slot {
  startTime: string
  endTime: string
  available: boolean
  remainingCapacity: number
  totalCapacity: number
}

interface BookingDetailItem {
  id: string
  bookingNumber: string
  bookingDate: string
  startTime: string
  endTime: string
  participants: number
  status: string
  cancellationReason?: string | null
  productId: string
}

interface ProductItem {
  id: string
  name: string
  price: number
}

interface RescheduleItem {
  originalDate: string
  originalStartTime: string
  originalEndTime: string
  newDate: string
  newStartTime: string
  newEndTime: string
  reason?: string | null
}

interface BookingDetailProps {
  booking: BookingDetailItem
  product?: ProductItem | null
  reschedules: RescheduleItem[]
}

export function BookingDetailView({ booking, product, reschedules }: BookingDetailProps) {
  const router = useRouter()
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState("")
  const [mountedTime] = useState(() => Date.now())

  const bookingDateTime = new Date(`${booking.bookingDate}T${booking.startTime}+07:00`)
  const isMoreThan24Hours = (bookingDateTime.getTime() - mountedTime) / (1000 * 60 * 60) >= 24
  const canReschedule = booking.status === "confirmed" && reschedules.length === 0 && isMoreThan24Hours
  const canCancel = booking.status === "pending"

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  function handleNewDateChange(val: string) {
    setNewDate(val)
    if (val) {
      setLoadingSlots(true)
      setSelectedSlot(null)
      setError("")
    }
  }

  useEffect(() => {
    if (!newDate || !booking.productId) return
    let active = true

    fetch(`/api/availability?productId=${booking.productId}&date=${newDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        if (data.error) setError(data.error)
        else setAvailableSlots(data.slots || [])
      })
      .catch(() => {
        if (active) setError("Gagal memuat jadwal slot pengganti")
      })
      .finally(() => {
        if (active) setLoadingSlots(false)
      })

    return () => {
      active = false
    }
  }, [newDate, booking.productId])

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) {
      setError("Silakan pilih slot waktu baru yang tersedia.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          newDate,
          newStartTime: selectedSlot.startTime,
          newEndTime: selectedSlot.endTime,
          reason,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal melakukan reschedule")

      toast.success("Jadwal sesi berhasil diubah.")
      setShowReschedule(false)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses reschedule"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm("Apakah Anda yakin ingin membatalkan booking ini sebelum pembayaran?")) return
    setCancelling(true)

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal membatalkan booking")

      toast.success("Booking berhasil dibatalkan.")
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal membatalkan"
      toast.error(message)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Contextual Back Button */}
      <div>
        <Link
          href="/account/bookings"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Riwayat Booking</span>
        </Link>
      </div>

      <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-4 border-b border-[#f3f1eb]/[0.08] pb-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#6f6f6a] block">
              {booking.bookingNumber}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#f3f1eb] font-normal">{product?.name || "Booking Sesi"}</h1>
          </div>
          <span
            className={`font-mono text-[10px] uppercase px-3 py-1 border self-start sm:self-auto ${
              booking.status === "confirmed"
                ? "bg-[#141414] text-[#f3f1eb] border-[#f3f1eb]/[0.3]"
                : booking.status === "cancelled"
                ? "bg-[#1f0d0d] text-[#e88] border-[#6b1e1e]"
                : "bg-[#111111] text-[#e8e6df] border-[#6f6f6a]/[0.4]"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a] uppercase tracking-wider">Tanggal Sesi</p>
            <p className="font-mono font-medium text-[#f3f1eb] text-sm">{booking.bookingDate}</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a] uppercase tracking-wider">Waktu Sesi</p>
            <p className="font-mono font-medium text-[#e8e6df] text-sm">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)} WIB
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a] uppercase tracking-wider">Jumlah Peserta</p>
            <p className="font-mono text-sm text-[#f3f1eb]">{booking.participants} orang</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[#6f6f6a] uppercase tracking-wider">Biaya Terdaftar</p>
            <p className="font-mono text-sm text-[#f3f1eb]">{product ? formatRupiah(product.price) : "-"}</p>
          </div>
        </div>

        {booking.status === "cancelled" && (
          <div className="border border-[#6b1e1e] bg-[#1f0d0d] p-4 font-mono text-xs text-[#e88] space-y-1">
            <p className="font-bold">Status Pembatalan:</p>
            <p>{booking.cancellationReason || "Booking telah dibatalkan."}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#f3f1eb]/[0.08] flex flex-wrap items-center gap-3">
          {canReschedule && !showReschedule && (
            <Button
              onClick={() => setShowReschedule(true)}
              variant="outline"
              className="font-mono text-[11px] uppercase tracking-wider border-[#f3f1eb]/[0.2] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] rounded-none flex items-center gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Jadwalkan Ulang (Reschedule)</span>
            </Button>
          )}

          {booking.status === "confirmed" && reschedules.length === 0 && !isMoreThan24Hours && (
            <span className="font-mono text-[11px] text-[#6f6f6a] italic">
              * Reschedule tidak lagi dapat diajukan (kurang dari 24 jam sebelum jadwal sesi).
            </span>
          )}

          {booking.status === "confirmed" && reschedules.length >= 1 && (
            <span className="font-mono text-[11px] text-[#6f6f6a] italic">
              * Batas kuota reschedule telah digunakan (maksimal 1 kali).
            </span>
          )}

          {canCancel && (
            <Button
              onClick={handleCancel}
              variant="destructive"
              disabled={cancelling}
              className="font-mono text-[11px] uppercase tracking-wider rounded-none"
            >
              {cancelling ? "Membatalkan..." : "Batalkan Booking"}
            </Button>
          )}
        </div>

        {booking.status !== "cancelled" && (
          <div className="pt-4 border-t border-[#f3f1eb]/[0.06]">
            <AddToCalendar
              title={`Sesi ${product?.name || "Noire Space"} - ${booking.bookingNumber}`}
              description={`Reservasi Noire Space #${booking.bookingNumber}. Hadir 10 menit sebelum sesi dimulai.`}
              date={booking.bookingDate}
              startTime={booking.startTime}
              endTime={booking.endTime}
            />
          </div>
        )}
      </div>

      {/* Reschedule Interactive Picker */}
      {showReschedule && (
        <form onSubmit={handleReschedule} className="border border-[#f3f1eb]/[0.2] bg-[#111111] p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#f3f1eb] flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-[#e8e6df]" />
              <span>PILIH JADWAL PENGGANTI</span>
            </h2>
            <p className="font-mono text-[10px] text-[#6f6f6a]">
              Reschedule hanya dapat dilakukan maksimal 1 kali dan minimal 24 jam sebelum jadwal sesi awal.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-[#3a1111] border border-[#6b1e1e] p-3 font-mono text-xs text-[#c96] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#e8e6df] block">
              1. PILIH TANGGAL BARU
            </label>
            <input
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={newDate}
              onChange={(e) => handleNewDateChange(e.target.value)}
              required
              className="w-full border border-[#f3f1eb]/[0.12] bg-[#0a0a0a] px-4 py-2.5 font-mono text-xs text-[#f3f1eb] focus:outline-none focus:border-[#f3f1eb]/[0.4]"
            />
          </div>

          {newDate && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#e8e6df] block">
                2. PILIH SLOT JAM BARU
              </label>

              {loadingSlots && (
                <p className="font-mono text-xs text-[#6f6f6a] animate-pulse">Memeriksa ketersediaan slot...</p>
              )}

              {!loadingSlots && availableSlots.length === 0 && (
                <p className="font-mono text-xs text-[#6f6f6a]">Tidak ada slot kosong pada tanggal ini. Coba pilih tanggal lain.</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((s, idx) => {
                  const isSelected = selectedSlot?.startTime === s.startTime
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(s)}
                      className={`p-3 border text-left font-mono text-xs transition-all ${
                        !s.available
                          ? "opacity-30 cursor-not-allowed bg-[#0a0a0a] border-[#f3f1eb]/5"
                          : isSelected
                          ? "border-[#f3f1eb] bg-[#141414] text-[#f3f1eb] font-bold ring-1 ring-[#f3f1eb]"
                          : "border-[#f3f1eb]/10 bg-[#0a0a0a] text-[#e8e6df] hover:border-[#f3f1eb]/30"
                      }`}
                    >
                      <p className="font-semibold">{formatTime(s.startTime)} - {formatTime(s.endTime)}</p>
                      <p className="text-[10px] text-[#6f6f6a] mt-0.5">{s.available ? "Tersedia" : "Penuh"}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#e8e6df] block">
              ALASAN PENJADWALAN ULANG (OPSIONAL)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Berhalangan hadir / bentrok acara"
              className="w-full border border-[#f3f1eb]/[0.12] bg-[#0a0a0a] px-4 py-2.5 font-mono text-xs text-[#f3f1eb] focus:outline-none focus:border-[#f3f1eb]/[0.4]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || !selectedSlot}
              className="h-10 font-mono text-[10px] uppercase tracking-widest font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none"
            >
              {loading ? "Menyimpan..." : "Konfirmasi Jadwal Baru"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowReschedule(false)}
              className="h-10 font-mono text-[10px] uppercase tracking-widest rounded-none text-[#6f6f6a] hover:text-[#f3f1eb]"
            >
              Batal
            </Button>
          </div>
        </form>
      )}

      {/* Historical Reschedules */}
      {reschedules.length > 0 && (
        <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#6f6f6a]">
            Riwayat Penjadwalan Ulang
          </h2>
          <div className="divide-y divide-[#f3f1eb]/[0.08] font-mono text-xs text-[#6f6f6a]">
            {reschedules.map((r, i) => (
              <div key={i} className="py-3 space-y-1">
                <p>
                  Semula: <strong className="text-[#e8e6df]">{r.originalDate} ({formatTime(r.originalStartTime)} - {formatTime(r.originalEndTime)})</strong>
                </p>
                <p>
                  Menjadi: <strong className="text-[#f3f1eb]">{r.newDate} ({formatTime(r.newStartTime)} - {formatTime(r.newEndTime)})</strong>
                </p>
                {r.reason && <p className="italic text-[#6f6f6a]">Alasan: {r.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
