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
          <Link href="/admin" className="flex items-baseline gap-2 font-display text-lg tracking-[0.16em] text-[#f3f1eb]">
            NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup navigasi admin"
            className="md:hidden text-[#6f6f6a] hover:text-[#f3f1eb] p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a] px-1 border-b border-[#f3f1eb]/[0.08] pb-3">
          SYSTEM / CONSOLE
        </p>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-[11px] font-medium transition-colors focus-visible:ring-1 focus-visible:ring-[#f3f1eb]/[0.3] outline-none border-l-2",
                  isActive
                    ? "bg-[#141414] text-[#f3f1eb] border-[#f3f1eb]"
                    : "text-[#6f6f6a] hover:bg-[#111111] hover:text-[#f3f1eb] border-transparent"
                )}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-mono uppercase tracking-wider text-[10px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#f3f1eb]/[0.08] px-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors py-1"
        >
          <span>Buka Website Publik</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Topbar for Admin */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#0a0a0a] border-b border-[#f3f1eb]/[0.08] z-30 px-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-baseline gap-1 font-display text-base tracking-[0.16em] text-[#f3f1eb]">
          NOIRE <span className="text-[#6f6f6a] font-light">SPACE</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka navigasi menu admin"
          className="p-1.5 border border-[#f3f1eb]/[0.1] text-[#f3f1eb] hover:bg-[#111111]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#0e0e0e] border-r border-[#f3f1eb]/[0.1] p-5 h-full overflow-y-auto animate-in slide-in-from-left duration-150">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Static Sidebar */}
      <aside className="hidden md:block w-64 border-r border-[#f3f1eb]/[0.08] bg-[#0e0e0e] min-h-screen p-5 sticky top-0 h-screen overflow-y-auto shrink-0">
        {navContent}
      </aside>
    </>
  )
}
