"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, ShoppingCart, User } from "lucide-react"

const accountNav = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Jadwal Booking", href: "/account/bookings", icon: Calendar },
  { label: "Riwayat Pesanan", href: "/account/orders", icon: ShoppingCart },
  { label: "Profil Akun", href: "/account/profile", icon: User },
]

export function CustomerSidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="md:w-60 space-y-1 shrink-0">
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold px-3 pb-2">
        Navigasi Akun
      </p>
      {accountNav.map((item) => {
        const isActive =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-[#18181b] text-white border border-white/[0.12] shadow-[0_0_15px_rgba(255,255,255,0.03)]"
                : "text-neutral-400 hover:bg-[#18181b]/60 hover:text-white border border-transparent"
            }`}
          >
            <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-amber-400" : "text-neutral-500"}`} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </aside>
  )
}

export const CustomerSidebar = CustomerSidebarNav

