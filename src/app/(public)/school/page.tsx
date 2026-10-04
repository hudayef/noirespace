"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SchoolProgramPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const payload = {
      schoolName: formData.get("schoolName"),
      picName: formData.get("picName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      studentCount: formData.get("studentCount") ? Number(formData.get("studentCount")) : undefined,
      programInterest: formData.get("programInterest"),
      locationPreference: formData.get("locationPreference"),
      notes: formData.get("notes"),
    }

    try {
      const res = await fetch("/api/school/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal mengirim formulir")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">B2B Education Partnership</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">PROGRAM SEKOLAH</h1>
        <p className="text-lg text-muted-foreground">
          Kolaborasi kurikulum teknologi kreatif, workshop intensif, dan ekstrakurikuler digital untuk sekolah tingkat SMP, SMA, dan SMK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border p-6 space-y-2">
              <h2 className="text-lg font-bold">School Workshop</h2>
              <p className="text-sm text-muted-foreground">Sesi intensif setengah hari atau sehari penuh mengenalkan dasar fotografi, editing, dan AI creator tools.</p>
            </div>
            <div className="rounded-lg border p-6 space-y-2">
              <h2 className="text-lg font-bold">Creative Extracurricular</h2>
              <p className="text-sm text-muted-foreground">Program ekstrakurikuler terstruktur 1 semester dengan mentor praktisi dan showcase portofolio.</p>
            </div>
            <div className="rounded-lg border p-6 space-y-2">
              <h2 className="text-lg font-bold">Creative Day & Study Trip</h2>
              <p className="text-sm text-muted-foreground">Kunjungan langsung ke Noire Space Studio untuk hands-on experience dengan fasilitas industri.</p>
            </div>
            <div className="rounded-lg border p-6 space-y-2">
              <h2 className="text-lg font-bold">Custom Curriculum</h2>
              <p className="text-sm text-muted-foreground">Perancangan silabus khusus sesuai visi dan kebutuhan kejuruan atau pengayaan sekolah.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Pengajuan Kerjasama</h2>
              <p className="text-xs text-muted-foreground mt-1">Tim kami akan meninjau dan mengirimkan proposal dalam 1-2 hari kerja.</p>
            </div>

            {success ? (
              <div className="rounded-md bg-accent p-6 text-center space-y-2">
                <p className="font-bold text-foreground">Pengajuan Terkirim</p>
                <p className="text-xs text-muted-foreground">Terima kasih atas minat Anda. PIC Noire Space akan segera menghubungi nomor telepon dan email yang tercantum.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">{error}</div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="schoolName" className="text-xs">Nama Sekolah / Institusi</Label>
                  <Input id="schoolName" name="schoolName" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="picName" className="text-xs">Nama Penanggung Jawab (PIC)</Label>
                  <Input id="picName" name="picName" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs">Email PIC</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs">No. WhatsApp</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="studentCount" className="text-xs">Estimasi Siswa</Label>
                    <Input id="studentCount" name="studentCount" type="number" min="1" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="programInterest" className="text-xs">Program Peminatan</Label>
                    <Input id="programInterest" name="programInterest" placeholder="Workshop / Ekstra" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-xs">Kebutuhan / Catatan Tambahan</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Mengirim..." : "Kirim Pengajuan"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
