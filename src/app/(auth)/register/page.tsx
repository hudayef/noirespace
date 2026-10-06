"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Lock } from "lucide-react"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal membuat akun")
      }

      toast.success("Akun berhasil dibuat. Silakan masuk.")
      router.push(`/login?registered=true${redirectUrl !== "/" ? `&redirect=${encodeURIComponent(redirectUrl)}` : ""}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan"
      setError(message)
      toast.error(message)
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="block font-display text-2xl tracking-[0.16em] text-[#f3f1eb]">
          NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f6f6a]">REGISTRASI AKUN</p>
        <p className="text-[11px] text-[#6f6f6a]">Daftar untuk reservasi studio dan program edukasi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-[#3a1111] border border-[#6b1e1e] p-3 text-[11px] text-[#c96] flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="reg-name" className="text-[11px] text-[#e8e6df]">NAMA LENGKAP</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
            <Input
              id="reg-name"
              name="name"
              required
              placeholder="Nama lengkap Anda"
              className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="text-[11px] text-[#e8e6df]">EMAIL AKTIF</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
            <Input
              id="reg-email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-phone" className="text-[11px] text-[#e8e6df]">NOMOR TELEPON / WA</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
            <Input
              id="reg-phone"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="reg-pass" className="text-[11px] text-[#e8e6df]">KATA SANDI</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
              <Input
                id="reg-pass"
                name="password"
                type="password"
                required
                placeholder="Min 8 karakter"
                className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm" className="text-[11px] text-[#e8e6df]">ULANGI SANDI</Label>
            <Input
              id="reg-confirm"
              name="confirmPassword"
              type="password"
              required
              placeholder="Ketik ulang"
              className="bg-[#0a0a0a] text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-[10px] uppercase tracking-[0.2em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none transition-colors mt-2"
          disabled={loading}
        >
          {loading ? "MENDAFTARKAN..." : "DAFTAR AKUN"}
        </Button>
      </form>

      <div className="text-center text-[11px] text-[#6f6f6a] pt-2 border-t border-[#f3f1eb]/[0.06]">
        Sudah memiliki akun?{" "}
        <Link
          href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="text-[#f3f1eb] font-medium hover:underline"
        >
          Masuk ke akun
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-neutral-400">Memuat form pendaftaran...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
