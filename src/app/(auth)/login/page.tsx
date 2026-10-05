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
    <div className="rounded-2xl border border-white/[0.08] bg-[#121217] p-8 space-y-6 shadow-2xl">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block text-xl font-extrabold tracking-[0.25em] text-white">
          NOIRE<span className="text-white/40 font-light">SPACE</span>
        </Link>
        <p className="text-xs text-neutral-400">Masuk ke akun Anda untuk mengelola sesi dan pesanan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs text-neutral-300">Alamat Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="login-email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-xs text-neutral-300">Kata Sandi</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-[#09090b] pl-9 text-xs h-10 border-white/[0.12]"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 mt-2"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk ke Akun"}
        </Button>
      </form>

      <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/[0.06]">
        Belum memiliki akun?{" "}
        <Link href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`} className="text-white font-semibold underline hover:text-amber-300">
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
