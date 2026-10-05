import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"

export default async function HomePage() {
  const featured = await getProducts({ status: "published" })
  const topProducts = featured.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-neutral-100 selection:bg-white selection:text-black">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION WITH STUDIO AMBIENT SPOTLIGHT */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40 border-b border-white/[0.06]">
          {/* Subtle Radial Ambient Lighting (Tungsten Gold & Obsidian Glow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-amber-200/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

          {/* Grid lines background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center space-y-8 max-w-4xl">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-medium">
                Studio & Edukasi Aktif di Bogor
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-white leading-[1.05]">
              WHERE CREATIVITY <br className="hidden sm:inline" />
              MEETS <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">COMMERCE.</span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Ekosistem teknologi kreatif generasi muda: rental studio berstandar industri, program inkubasi kreator, produksi visual, dan kemitraan kurikulum sekolah.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/studio" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.18)] transition-all">
                  Reservasi Studio ↗
                </Button>
              </Link>
              <Link href="/programs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-xs uppercase tracking-widest font-semibold border-white/[0.15] bg-white/[0.02] text-neutral-300 hover:text-white hover:bg-white/[0.08] backdrop-blur-sm transition-all">
                  Jelajahi Program Edukasi
                </Button>
              </Link>
            </div>

            {/* Editorial Micro-Metrics Strip */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.06] text-left">
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">3 Rooms</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Studio Terkalibrasi</p>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">Industrial</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Lighting & Gear Grade</p>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">Project-Led</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Edukasi Siap Kerja</p>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">B2B Ready</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">Workshop Sekolah</p>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE-DRIVEN DISCOVERY — EDITORIAL BENTO GRID */}
        <section className="py-28 container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400/90 font-semibold">
                Discovery Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Apa yang ingin kamu wujudkan?
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-md">
              Pilih jalur kebutuhanmu. Platform Noire Space memfasilitasi kreator individu, brand komersial, hingga institusi pendidikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Studio (Dominant) */}
            <Link
              href="/studio"
              className="group md:col-span-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#131318] to-[#0c0c10] p-8 lg:p-10 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold">
                    Studio Experience
                  </span>
                  <span className="text-xl text-neutral-500 group-hover:text-white transition-colors">↗</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  Sewa Studio Foto & Konten Profesional
                </h3>
                <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                  Ruang kreatif siap pakai dengan tata cahaya terkalibrasi, lighting Godox & Aputure, multi-backdrop, dan asistensi teknis ruang. Pilihan sesi fleksibel mulai 30 menit.
                </p>
              </div>
              <div className="pt-8 mt-8 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <span>Mulai dari <strong className="text-white">Rp 75.000</strong></span>
                <span className="text-amber-300/80 group-hover:underline font-semibold">Lihat Kalender Slot →</span>
              </div>
            </Link>

            {/* Bento Card 2: Creative Education */}
            <Link
              href="/programs"
              className="group md:col-span-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#131318] to-[#0c0c10] p-8 flex flex-col justify-between hover:border-indigo-400/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold">
                    Education
                  </span>
                  <span className="text-xl text-neutral-500 group-hover:text-white transition-colors">↗</span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                  Inkubasi Skill Kreator & AI
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Kurikulum berbasis proyek langsung: fotografi komersial, video production, dan workflow AI untuk portofolio siap kerja.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <span>Junior & Pro Class</span>
                <span className="text-indigo-300 group-hover:underline font-semibold">Pilih Kelas →</span>
              </div>
            </Link>

            {/* Bento Card 3: Creative Services */}
            <Link
              href="/services"
              className="group md:col-span-5 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#131318] to-[#0c0c10] p-8 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold">
                    Production Service
                  </span>
                  <span className="text-xl text-neutral-500 group-hover:text-white transition-colors">↗</span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Produksi Konten Brand & Produk
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Layanan lengkap dari pra-produksi, pemotretan katalog e-commerce, hingga output media sosial berstandar tinggi.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <span>Digital Ready Assets</span>
                <span className="text-cyan-300 group-hover:underline font-semibold">Detail Layanan →</span>
              </div>
            </Link>

            {/* Bento Card 4: School Programs */}
            <Link
              href="/school"
              className="group md:col-span-7 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#131318] to-[#0c0c10] p-8 flex flex-col justify-between hover:border-emerald-400/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold">
                    B2B Partnership
                  </span>
                  <span className="text-xl text-neutral-500 group-hover:text-white transition-colors">↗</span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                  Kemitraan Sekolah & Workshop Ekstrakurikuler
                </h3>
                <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
                  Program terstruktur untuk SMP, SMA, dan SMK. Pengenalan industri visual kreatif modern dengan kunjungan studio dan mentor praktisi.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
                <span>Pengajuan Proposal Formal</span>
                <span className="text-emerald-300 group-hover:underline font-semibold">Ajukan Kerjasama →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* FEATURED SELECTION STRIP */}
        {topProducts.length > 0 && (
          <section className="py-24 border-y border-white/[0.06] bg-[#070709]">
            <div className="container mx-auto px-6 lg:px-12 space-y-12">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                    Paling Sering Dipesan
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Paket Populer Noire Space
                  </h2>
                </div>
                <Link href="/programs" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white font-semibold">
                  Semua Layanan →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topProducts.map((p) => {
                  const href = p.type === "studio" ? `/studio/${p.slug}` : p.type === "education" ? `/programs/${p.slug}` : `/services/${p.slug}`
                  return (
                    <div key={p.id} className="rounded-xl border border-white/[0.08] bg-[#0d0d12] p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">{p.type}</span>
                        <h3 className="text-lg font-bold text-white">{p.name}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-2">{p.shortDescription || p.description}</p>
                        <div className="text-xs text-neutral-500 pt-2 flex gap-4">
                          {p.durationMinutes && <span>{p.durationMinutes} Menit</span>}
                          {p.capacity && <span>Maks {p.capacity} Orang</span>}
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Tarif</span>
                          <span className="font-bold text-base text-white">{formatRupiah(p.price)}</span>
                        </div>
                        <Link href={href}>
                          <Button size="sm" className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-4">
                            Pesan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* BRAND STATEMENT / CALL TO ACTION */}
        <section className="py-28 relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 text-center space-y-6 max-w-2xl relative z-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400/90 font-semibold">
              Join the Ecosystem
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Kreativitas Anda layak mendapatkan ruang yang tepat.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Mulai dari sesi studio 30 menit hingga program pembinaan intensif portofolio bersama mentor industri.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  Buat Akun Gratis ↗
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
