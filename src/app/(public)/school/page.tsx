"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, CheckCircle2, RotateCcw } from "lucide-react"

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
      schoolName: formData.get("schoolName") as string,
      picName: formData.get("picName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      studentCount: formData.get("studentCount") ? Number(formData.get("studentCount")) : undefined,
      programInterest: (formData.get("programInterest") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
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
      toast.success("Pengajuan kerjasama sekolah berhasil dikirim.")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 space-y-12">
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-emerald-400 font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <span>B2B Education Partnership</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">PROGRAM SEKOLAH</h1>
        <p className="text-base text-neutral-300 leading-relaxed">
          Kolaborasi kurikulum teknologi kreatif, workshop intensif, dan ekstrakurikuler digital untuk sekolah tingkat SMP, SMA, dan SMK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-2">
              <h2 className="text-lg font-bold text-white">School Workshop</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sesi intensif setengah hari atau sehari penuh mengenalkan dasar fotografi, editing, dan AI creator tools.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-2">
              <h2 className="text-lg font-bold text-white">Creative Extracurricular</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Program ekstrakurikuler terstruktur 1 semester dengan mentor praktisi dan showcase portofolio.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-2">
              <h2 className="text-lg font-bold text-white">Creative Day & Study Trip</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kunjungan langsung ke Noire Space Studio untuk hands-on experience dengan fasilitas industri.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 space-y-2">
              <h2 className="text-lg font-bold text-white">Custom Curriculum</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Perancangan silabus khusus sesuai visi dan kebutuhan kejuruan atau pengayaan sekolah.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121217] p-6 lg:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Pengajuan Kerjasama</h2>
              <p className="text-xs text-neutral-400 mt-1">Tim kami akan meninjau dan mengirimkan proposal dalam 1-2 hari kerja.</p>
            </div>

            {success ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">Pengajuan Berhasil Terkirim</p>
                  <p className="text-xs text-neutral-300">
                    Terima kasih atas minat Anda. PIC Noire Space akan segera menghubungi kontak yang tercantum.
                  </p>
                </div>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  size="sm"
                  className="text-xs uppercase tracking-wider font-semibold border-white/20 flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kirim Formulir Lain</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                    {error}
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="schoolName" className="text-xs text-neutral-300">Nama Sekolah / Institusi</Label>
                  <Input id="schoolName" name="schoolName" required className="bg-[#09090b] text-xs h-9" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="picName" className="text-xs text-neutral-300">Nama Penanggung Jawab (PIC)</Label>
                  <Input id="picName" name="picName" required className="bg-[#09090b] text-xs h-9" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs text-neutral-300">Email PIC</Label>
                    <Input id="email" name="email" type="email" required className="bg-[#09090b] text-xs h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs text-neutral-300">No. WhatsApp</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="08xxxxxxxx" className="bg-[#09090b] text-xs h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="studentCount" className="text-xs text-neutral-300">Estimasi Siswa</Label>
                    <Input id="studentCount" name="studentCount" type="number" min="1" className="bg-[#09090b] text-xs h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="programInterest" className="text-xs text-neutral-300">Program Peminatan</Label>
                    <Input id="programInterest" name="programInterest" placeholder="Workshop / Ekstra" className="bg-[#09090b] text-xs h-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-xs text-neutral-300">Kebutuhan Tambahan</Label>
                  <Textarea id="notes" name="notes" rows={3} className="bg-[#09090b] text-xs" />
                </div>
                <Button
                  type="submit"
                  className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 h-10 mt-1"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Pengajuan Kemitraan"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
