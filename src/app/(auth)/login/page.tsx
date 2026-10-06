"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"

function LoginForm() {
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
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password tidak sesuai.")
      toast.error("Gagal masuk. Periksa kembali email dan password.")
      setLoading(false)
    } else {
      toast.success("Berhasil masuk.")
      router.push(redirectUrl)
      router.refresh()
    }
  }

  return (
    <div className="rounded-xl border border-[#f3f1eb]/[0.1] bg-[#111111] p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="block font-display text-2xl tracking-[0.16em] text-[#f3f1eb]">
          NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f6f6a]">MEMASUKKAN AKUN</p>
        <p className="text-[11px] text-[#6f6f6a]">Masuk untuk mengelola sesi dan pesanan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-[#3a1111] border border-[#6b1e1e] p-3 text-[11px] text-[#c96] flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-[11px] text-[#e8e6df]">ALAMAT EMAIL</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
            <Input
              id="login-email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-[11px] text-[#e8e6df]">KATA SANDI</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6f6f6a]" />
            <Input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-[#0a0a0a] pl-9 text-xs h-10 border-[#f3f1eb]/[0.12] text-[#f3f1eb] placeholder:text-[#6f6f6a]/40"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-[10px] uppercase tracking-[0.2em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none transition-colors"
          disabled={loading}
        >
          {loading ? "MEMPROSES..." : "MASUK"}
        </Button>
      </form>

      <div className="text-center text-[11px] text-[#6f6f6a] pt-2 border-t border-[#f3f1eb]/[0.06]">
        Belum memiliki akun?{" "}
        <Link
          href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="text-[#f3f1eb] font-medium hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-neutral-400">Memuat form login...</div>}>
      <LoginForm />
    </Suspense>
  )
}
