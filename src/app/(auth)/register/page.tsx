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
    <div className="rounded-2xl border border-white/[0.08] bg-[#121217] p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block text-xl font-extrabold tracking-[0.25em] text-white">
          NOIRE<span className="text-white/40 font-light">SPACE</span>
        </Link>
        <p className="text-xs text-neutral-400">Buat akun untuk melakukan booking studio & pendaftaran program</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="reg-name" className="text-xs text-neutral-300">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="reg-name"
              name="name"
              required
              placeholder="Nama lengkap Anda"
              className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="text-xs text-neutral-300">Email Aktif</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="reg-email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-phone" className="text-xs text-neutral-300">Nomor Telepon / WhatsApp</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="reg-phone"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="reg-pass" className="text-xs text-neutral-300">Kata Sandi</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                id="reg-pass"
                name="password"
                type="password"
                required
                placeholder="Min 8 karakter"
                className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm" className="text-xs text-neutral-300">Ulangi Sandi</Label>
            <Input
              id="reg-confirm"
              name="confirmPassword"
              type="password"
              required
              placeholder="Ketik ulang"
              className="bg-[#09090b] text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 mt-2"
          disabled={loading}
        >
          {loading ? "Mendaftarkan..." : "Daftar Akun Baru"}
        </Button>
      </form>

      <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
        Sudah memiliki akun?{" "}
        <Link href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`} className="text-white font-semibold underline hover:text-amber-300">
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
