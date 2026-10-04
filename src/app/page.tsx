import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const discoveries = [
  { label: "Buat Foto", href: "/studio", description: "Studio foto profesional dengan peralatan lengkap" },
  { label: "Buat Konten", href: "/services", description: "Produksi konten untuk media sosial dan bisnis" },
  { label: "Belajar Skill", href: "/programs", description: "Program edukasi creative technology" },
  { label: "Bangun Portfolio", href: "/programs", description: "Dari nol sampai punya portfolio profesional" },
  { label: "Program Sekolah", href: "/school", description: "Workshop dan program untuk institusi pendidikan" },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative flex items-center justify-center min-h-[80vh] bg-black text-white">
          <div className="container text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              NOIRE SPACE
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Creative Technology Ecosystem
            </p>
            <p className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
              Learn. Create. Earn.
            </p>
            <div className="pt-4">
              <Link href="/programs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Apa yang ingin kamu buat?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Temukan layanan yang tepat untuk kebutuhanmu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveries.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-lg border p-8 hover:bg-accent transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-black text-white py-24">
          <div className="container text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Siap untuk memulai?</h2>
            <p className="text-white/70 max-w-lg mx-auto">
              Bergabung dengan komunitas kreator muda di Noire Space
            </p>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
