"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionLabel } from "@/components/editorial"
import { CheckCircle2, RotateCcw } from "lucide-react"

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
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
      <div className="max-w-3xl space-y-4">
        <SectionLabel number="04" label="INSTITUTIONAL PARTNERSHIP" />
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3f1eb] leading-tight">
          PROGRAM SEKOLAH
        </h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed">
          Kolaborasi kurikulum teknologi kreatif, workshop intensif, ekstrakurikuler digital, dan kunjungan studio untuk SMP, SMA, dan SMK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-2">
              <span className="text-[#6f6f6a]">01 /</span>
              <h2 className="font-display text-lg text-[#f3f1eb] font-normal">School Workshop</h2>
              <p className="text-[#6f6f6a] leading-relaxed">
                Sesi intensif setengah hari atau sehari penuh: dasar fotografi, editing, dan AI creator tools.
              </p>
            </div>
            <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-2">
              <span className="text-[#6f6f6a]">02 /</span>
              <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Creative Extracurricular</h2>
              <p className="text-[#6f6f6a] leading-relaxed">
                Program ekstrakurikuler terstruktur 1 semester, mentor praktisi, ditutup showcase portofolio.
              </p>
            </div>
            <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-2">
              <span className="text-[#6f6f6a]">03 /</span>
              <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Creative Day & Study Trip</h2>
              <p className="text-[#6f6f6a] leading-relaxed">
                Kunjungan langsung ke Noire Space Studio untuk hands-on experience dengan fasilitas industri.
              </p>
            </div>
            <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 space-y-2">
              <span className="text-[#6f6f6a]">04 /</span>
              <h2 className="font-display text-lg text-[#f3f1eb] font-normal">Custom Curriculum</h2>
              <p className="text-[#6f6f6a] leading-relaxed">
                Perancangan silabus khusus sesuai visi dan kebutuhan kejuruan atau program pengayaan sekolah.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-[#f3f1eb]/[0.1] bg-[#111111] p-6 lg:p-8 space-y-6 sticky top-28">
            <div className="space-y-1">
              <SectionLabel number="01" label="PENGADUAN KERJASAMA" />
              <p className="text-xs text-[#6f6f6a]">
                Tim kami akan meninjau dan mengirimkan proposal dalam 1-2 hari kerja.
              </p>
            </div>

            {success ? (
              <div className="border border-[#f3f1eb]/[0.2] bg-[#111111] p-6 text-center space-y-4">
                <CheckCircle2 className="h-7 w-7 text-[#e8e6df] mx-auto" />
                <div className="space-y-1">
                  <p className="font-mono font-medium text-[#f3f1eb] text-sm">PENGADUAN BERHASIL TERKIRIM</p>
                  <p className="text-xs text-[#6f6f6a]">
                    Terima kasih atas minat Anda. PIC Noire Space akan segera menghubungi kontak yang tercantum.
                  </p>
                </div>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  size="sm"
                  className="font-mono text-[10px] uppercase tracking-wider border-[#f3f1eb]/[0.2] text-[#e8e6df] hover:text-[#f3f1eb] rounded-none flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Kirim Formulir Lain</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-[#3a1111] border border-[#6b1e1e] p-3 font-mono text-xs text-[#c96]">
                    {error}
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="schoolName" className="text-[11px] text-[#e8e6df]">NAMA SEKOLAH / INSTITUSI</Label>
                  <Input id="schoolName" name="schoolName" required className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="picName" className="text-[11px] text-[#e8e6df]">NAMA PENANGGUNG JAWAB (PIC)</Label>
                  <Input id="picName" name="picName" required className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[11px] text-[#e8e6df]">EMAIL PIC</Label>
                    <Input id="email" name="email" type="email" required className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-[11px] text-[#e8e6df]">NO. WHATSAPP</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="08xxxxxxxx" className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="studentCount" className="text-[11px] text-[#e8e6df]">ESTIMASI SISWA</Label>
                    <Input id="studentCount" name="studentCount" type="number" min="1" className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="programInterest" className="text-[11px] text-[#e8e6df]">PROGRAM PEMINATAN</Label>
                    <Input id="programInterest" name="programInterest" placeholder="Workshop / Ekstra" className="bg-[#0a0a0a] text-[11px] h-9 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-[11px] text-[#e8e6df]">KEBUTUHAN TAMBAHAN</Label>
                  <Textarea id="notes" name="notes" rows={3} className="bg-[#0a0a0a] text-[11px] text-[#f3f1eb] border-[#f3f1eb]/[0.12] placeholder:text-[#6f6f6a]/40" />
                </div>
                <Button
                  type="submit"
                  className="w-full font-mono text-[11px] uppercase tracking-[0.16em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none h-10 mt-1"
                  disabled={loading}
                >
                  {loading ? "MEMROSES..." : "KIRIM PENGADUAN"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
