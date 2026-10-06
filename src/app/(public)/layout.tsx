import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f3f1eb] selection:bg-[#f3f1eb] selection:text-[#0a0a0a]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
