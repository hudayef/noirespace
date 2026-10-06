import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0a0a] text-[#f3f1eb] selection:bg-[#f3f1eb] selection:text-[#0a0a0a] relative overflow-hidden px-4 py-12">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
