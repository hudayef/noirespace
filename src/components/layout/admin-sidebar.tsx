"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  DoorOpen,
  Wrench,
  Users,
  CalendarDays,
  BookOpen,
  ShoppingCart,
  CreditCard,
  GraduationCap,
  BarChart3,
  Settings,
  ScrollText,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk & Kelas", href: "/admin/products", icon: Package },
  { label: "Kategori", href: "/admin/categories", icon: FolderOpen },
  { label: "Ruangan Studio", href: "/admin/rooms", icon: DoorOpen },
  { label: "Peralatan", href: "/admin/resources", icon: Wrench },
  { label: "Instruktur", href: "/admin/instructors", icon: Users },
  { label: "Jadwal & Kalender", href: "/admin/schedules", icon: CalendarDays },
  { label: "Semua Booking", href: "/admin/bookings", icon: BookOpen },
  { label: "Pesanan (Orders)", href: "/admin/orders", icon: ShoppingCart },
  { label: "Log Pembayaran", href: "/admin/payments", icon: CreditCard },
  { label: "Data Pelanggan", href: "/admin/customers", icon: Users },
  { label: "Pengajuan Sekolah", href: "/admin/inquiries", icon: GraduationCap },
  { label: "Laporan & Omset", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
  { label: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        <div className="px-1 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-base font-extrabold tracking-[0.18em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            NOIRE<span className="text-white/40 font-light">SPACE</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup navigasi admin"
            className="md:hidden text-neutral-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold px-1">Operations Console</p>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                  isActive
                    ? "bg-white/[0.1] text-white border border-white/[0.1]"
                    : "text-neutral-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-300" : "text-neutral-500")} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/[0.08] px-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-neutral-400 hover:text-white transition-colors py-1"
        >
          <span>Buka Website Publik</span>
          <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Topbar for Admin */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#070709] border-b border-white/[0.08] z-30 px-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-extrabold tracking-[0.18em] text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          NOIRE<span className="text-white/40 font-light">SPACE</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka navigasi menu admin"
          className="p-1.5 rounded-md border border-white/10 text-neutral-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#070709] border-r border-white/10 p-5 h-full overflow-y-auto animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Static Sidebar */}
      <aside className="hidden md:block w-64 border-r border-white/[0.08] bg-[#070709] min-h-screen p-5 sticky top-0 h-screen overflow-y-auto shrink-0">
        {navContent}
      </aside>
    </>
  )
}
