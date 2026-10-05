import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CustomerSidebarNav } from "@/components/layout/customer-sidebar"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 selection:bg-white selection:text-black">
      <Header />
      <main className="flex-1 container mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          <CustomerSidebarNav />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
