"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/programs", label: "Program" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Layanan" },
  { href: "/school", label: "Sekolah" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" },
]

interface NavMenuProps {
  user: {
    name?: string | null
    roles?: string[]
  } | null
}

export function NavMenu({ user }: NavMenuProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.roles?.some((r) => ["super_admin", "admin", "staff"].includes(r))

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-neutral-400">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-white relative py-1",
                isActive && "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-amber-400 after:shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Desktop Auth CTA */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
              >
                {user.name || "Akun Saya"}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs uppercase tracking-wider border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <Link href="/login">
            <Button
              size="sm"
              className="text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 px-5 py-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Masuk
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center gap-3">
        {user && (
          <Link href="/account" className="text-xs font-bold text-neutral-300 border border-white/10 px-2.5 py-1.5 rounded-md">
            Akun
          </Link>
        )}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu navigasi"}
          className="p-2 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/[0.1] px-6 py-6 space-y-5 z-40 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-base uppercase tracking-wider font-semibold py-2.5 px-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-white/10 text-white font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/account" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-xs uppercase tracking-wider">
                    Dashboard Akun: {user.name}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-xs uppercase tracking-wider border-amber-500/30 text-amber-300">
                      Console Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200">
                  Masuk ke Akun
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
