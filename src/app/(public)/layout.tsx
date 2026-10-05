import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 selection:bg-white selection:text-black">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
