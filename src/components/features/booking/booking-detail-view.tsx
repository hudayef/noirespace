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
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Riwayat Booking</span>
        </Link>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
              {booking.bookingNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product?.name || "Booking Sesi"}</h1>
          </div>
          <span
            className={`text-xs uppercase font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
              booking.status === "confirmed"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : booking.status === "cancelled"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Tanggal Sesi</p>
            <p className="font-bold text-white text-base">{booking.bookingDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Waktu Sesi</p>
            <p className="font-bold text-amber-300 text-base">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)} WIB
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Jumlah Peserta</p>
            <p className="font-bold text-white">{booking.participants} orang</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Biaya Terdaftar</p>
            <p className="font-bold text-white">{product ? formatRupiah(product.price) : "-"}</p>
          </div>
        </div>

        {booking.status === "cancelled" && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-300 space-y-1">
            <p className="font-bold">Status Pembatalan:</p>
            <p>{booking.cancellationReason || "Booking telah dibatalkan."}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
          {canReschedule && !showReschedule && (
            <Button
              onClick={() => setShowReschedule(true)}
              variant="outline"
              className="text-xs uppercase tracking-wider font-semibold border-amber-500/40 text-amber-300 hover:bg-amber-500/10 flex items-center gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Jadwalkan Ulang (Reschedule)</span>
            </Button>
          )}

          {booking.status === "confirmed" && reschedules.length === 0 && !isMoreThan24Hours && (
            <span className="text-xs text-neutral-500 italic">
              * Reschedule tidak lagi dapat diajukan (kurang dari 24 jam sebelum jadwal sesi).
            </span>
          )}

          {booking.status === "confirmed" && reschedules.length >= 1 && (
            <span className="text-xs text-neutral-500 italic">
              * Batas kuota reschedule telah digunakan (maksimal 1 kali).
            </span>
          )}

          {canCancel && (
            <Button
              onClick={handleCancel}
              variant="destructive"
              disabled={cancelling}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              {cancelling ? "Membatalkan..." : "Batalkan Booking"}
            </Button>
          )}
        </div>

        {booking.status !== "cancelled" && (
          <div className="pt-4 border-t border-white/[0.06]">
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
        <form onSubmit={handleReschedule} className="rounded-xl border border-amber-400/30 bg-[#161513] p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-400" />
              <span>Pilih Jadwal Pengganti</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Reschedule hanya dapat dilakukan maksimal 1 kali dan minimal 24 jam sebelum jadwal sesi awal.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
              1. Pilih Tanggal Baru
            </label>
            <input
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={newDate}
              onChange={(e) => handleNewDateChange(e.target.value)}
              required
              className="w-full rounded-lg border border-white/[0.12] bg-[#09090b] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {newDate && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                2. Pilih Slot Jam Baru yang Tersedia
              </label>

              {loadingSlots && (
                <p className="text-xs text-neutral-400 animate-pulse">Memeriksa ketersediaan slot...</p>
              )}

              {!loadingSlots && availableSlots.length === 0 && (
                <p className="text-xs text-neutral-500">Tidak ada slot kosong pada tanggal ini. Coba pilih tanggal lain.</p>
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
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        !s.available
                          ? "opacity-30 cursor-not-allowed bg-black/40 border-white/5"
                          : isSelected
                          ? "border-amber-400 bg-amber-400/20 text-white font-bold ring-1 ring-amber-400"
                          : "border-white/10 bg-[#09090b] text-neutral-300 hover:border-white/30"
                      }`}
                    >
                      <p className="font-semibold">{formatTime(s.startTime)} - {formatTime(s.endTime)}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{s.available ? "Tersedia" : "Penuh"}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
              Alasan Penjadwalan Ulang (Opsional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Berhalangan hadir / bentrok acara"
              className="w-full rounded-lg border border-white/[0.12] bg-[#09090b] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || !selectedSlot}
              className="h-10 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200"
            >
              {loading ? "Menyimpan..." : "Konfirmasi Jadwal Baru"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowReschedule(false)}
              className="h-10 text-xs uppercase tracking-widest"
            >
              Batal
            </Button>
          </div>
        </form>
      )}

      {/* Historical Reschedules */}
      {reschedules.length > 0 && (
        <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Riwayat Penjadwalan Ulang
          </h2>
          <div className="divide-y border-white/[0.06] text-xs text-neutral-400">
            {reschedules.map((r, i) => (
              <div key={i} className="py-3 space-y-1">
                <p>
                  Semula: <strong className="text-neutral-200">{r.originalDate} ({formatTime(r.originalStartTime)} - {formatTime(r.originalEndTime)})</strong>
                </p>
                <p>
                  Menjadi: <strong className="text-amber-300">{r.newDate} ({formatTime(r.newStartTime)} - {formatTime(r.newEndTime)})</strong>
                </p>
                {r.reason && <p className="italic text-neutral-500">Alasan: {r.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
