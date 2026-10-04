import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

const accountNav = [
  { label: "Dashboard", href: "/account" },
  { label: "Booking", href: "/account/bookings" },
  { label: "Pesanan", href: "/account/orders" },
  { label: "Profil", href: "/account/profile" },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-48 space-y-1">
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}
