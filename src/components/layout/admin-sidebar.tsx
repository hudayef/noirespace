"use client"

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
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Kategori", href: "/admin/categories", icon: FolderOpen },
  { label: "Ruangan", href: "/admin/rooms", icon: DoorOpen },
  { label: "Resource", href: "/admin/resources", icon: Wrench },
  { label: "Instruktur", href: "/admin/instructors", icon: Users },
  { label: "Jadwal", href: "/admin/schedules", icon: CalendarDays },
  { label: "Booking", href: "/admin/bookings", icon: BookOpen },
  { label: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { label: "Pembayaran", href: "/admin/payments", icon: CreditCard },
  { label: "Pelanggan", href: "/admin/customers", icon: Users },
  { label: "Sekolah", href: "/admin/inquiries", icon: GraduationCap },
  { label: "Laporan", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background min-h-screen p-4">
      <div className="mb-8">
        <Link href="/admin" className="text-lg font-bold tracking-widest">
          NOIRE SPACE
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
