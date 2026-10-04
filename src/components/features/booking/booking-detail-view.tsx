"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatTime } from "@/lib/utils/format"

interface BookingDetailProps {
  booking: any
  product: any
  reschedules: any[]
}

export function BookingDetailView({ booking, product, reschedules }: BookingDetailProps) {
  const router = useRouter()
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newStart, setNewStart] = useState("")
  const [newEnd, setNewEnd] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canReschedule = booking.status === "confirmed" && reschedules.length === 0
  const canCancel = booking.status === "pending"

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          newDate,
          newStartTime: `${newStart}:00`,
          newEndTime: `${newEnd}:00`,
          reason,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal reschedule")

      setShowReschedule(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Gagal memproses reschedule")
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm("Batalkan booking ini sebelum pembayaran?")) return
    setLoading(true)

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal membatalkan booking")

      router.refresh()
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <span className="text-xs uppercase font-mono text-muted-foreground">{booking.bookingNumber}</span>
            <h1 className="text-2xl font-bold">{product?.name || "Booking Sesi"}</h1>
          </div>
          <span className="text-xs uppercase font-bold px-3 py-1 rounded-full border bg-muted">
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tanggal Sesi</p>
            <p className="font-semibold">{booking.bookingDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Waktu</p>
            <p className="font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)} WIB</p>
          </div>
          <div>
            <p className="text-muted-foreground">Jumlah Peserta</p>
            <p className="font-semibold">{booking.participants} orang</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status Pembatalan</p>
            <p className="font-semibold">{booking.status === "cancelled" ? (booking.cancellationReason || "Dibatalkan") : "Aktif"}</p>
          </div>
        </div>

        <div className="pt-4 border-t flex flex-wrap gap-3">
          {canReschedule && !showReschedule && (
            <Button onClick={() => setShowReschedule(true)} variant="outline">
              Ajukan Reschedule Jadwal
            </Button>
          )}

          {canCancel && (
            <Button onClick={handleCancel} variant="destructive" disabled={loading}>
              Batalkan Booking
            </Button>
          )}
        </div>
      </div>

      {showReschedule && (
        <form onSubmit={handleReschedule} className="rounded-lg border p-6 space-y-4 bg-muted/30">
          <h2 className="text-lg font-bold">Penjadwalan Ulang (Reschedule)</h2>
          <p className="text-xs text-muted-foreground">
            Sesuai kebijakan Noire Space, reschedule hanya dapat dilakukan maksimal 1 kali dan minimal 24 jam sebelum jadwal awal.
          </p>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Tanggal Baru</Label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Jam Mulai</Label>
              <Input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Jam Selesai</Label>
              <Input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Alasan Penjadwalan Ulang</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: Berhalangan hadir" />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Memvalidasi Slot..." : "Simpan Jadwal Baru"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowReschedule(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      {reschedules.length > 0 && (
        <div className="rounded-lg border p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Riwayat Reschedule</h2>
          <div className="divide-y text-xs text-muted-foreground">
            {reschedules.map((r, i) => (
              <div key={i} className="py-2">
                <p>Dari: <strong className="text-foreground">{r.originalDate} ({formatTime(r.originalStartTime)} - {formatTime(r.originalEndTime)})</strong></p>
                <p>Ke: <strong className="text-foreground">{r.newDate} ({formatTime(r.newStartTime)} - {formatTime(r.newEndTime)})</strong></p>
                {r.reason && <p className="italic mt-1">Alasan: {r.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
