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
      <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-[#f3f1eb] relative py-1",
                isActive && "text-[#f3f1eb] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#f3f1eb]"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Desktop Auth CTA */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-[11px] uppercase tracking-wider text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#111111] border border-[#f3f1eb]/[0.1] rounded-none px-3 h-8"
              >
                {user.name || "Akun"}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-[11px] uppercase tracking-wider border-[#f3f1eb]/[0.2] text-[#f3f1eb] hover:bg-[#171717] rounded-none px-3 h-8"
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
              className="font-mono text-[11px] uppercase tracking-[0.16em] font-medium bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df] rounded-none px-4 h-8 transition-colors"
            >
              Masuk
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center gap-2">
        {user && (
          <Link
            href="/account"
            className="font-mono text-[10px] uppercase tracking-wider text-[#f3f1eb] border border-[#f3f1eb]/[0.14] px-2.5 py-1"
          >
            Akun
          </Link>
        )}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu navigasi"}
          className="p-2 border border-[#f3f1eb]/[0.1] text-[#f3f1eb] hover:bg-[#111111] transition-colors"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 bg-[#0a0a0a]/98 border-b border-[#f3f1eb]/[0.1] px-6 py-6 space-y-5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col divide-y divide-[#f3f1eb]/[0.06]">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-mono text-xs uppercase tracking-[0.18em] py-3 transition-colors",
                    isActive ? "text-[#f3f1eb] font-semibold" : "text-[#6f6f6a] hover:text-[#f3f1eb]"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-[#f3f1eb]/[0.08] flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/account" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start font-mono text-[11px] uppercase tracking-wider rounded-none border-[#f3f1eb]/[0.15]">
                    Akun: {user.name}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start font-mono text-[11px] uppercase tracking-wider rounded-none border-[#f3f1eb]/[0.3] text-[#f3f1eb]">
                      Console Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full font-mono text-[11px] uppercase tracking-[0.18em] rounded-none bg-[#f3f1eb] text-[#0a0a0a] hover:bg-[#e8e6df]">
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
