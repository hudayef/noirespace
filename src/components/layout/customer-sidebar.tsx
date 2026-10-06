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
    <aside className="md:w-56 space-y-1 shrink-0 font-mono text-xs">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a] px-3 pb-3">
        01 / NAVIGASI
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
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors border-l-2 ${
              isActive
                ? "bg-[#141414] text-[#f3f1eb] border-[#f3f1eb] font-medium"
                : "text-[#6f6f6a] hover:bg-[#111111] hover:text-[#f3f1eb] border-transparent"
            }`}
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            <span className="uppercase tracking-wider text-[11px]">{item.label}</span>
          </Link>
        )
      })}
    </aside>
  )
}

export const CustomerSidebar = CustomerSidebarNav

