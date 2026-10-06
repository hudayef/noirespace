import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { SectionLabel, CatalogRow } from "@/components/editorial"

export default async function HomePage() {
  const publishedProducts = await getProducts({ status: "published" })
  const curatedProducts = publishedProducts.slice(0, 5)

  const capabilities = [
    {
      index: "01",
      title: "CREATIVE STUDIO",
      category: "PRODUCTION SPACE",
      description: "Ruang fotografi dan produksi visual terkalibrasi dengan tata cahaya industri, multi-backdrop, dan asistensi teknis ruang.",
      metadata: "3 RUANGAN · GODOX & APUTURE · H-1 RESERVASI",
      href: "/studio",
      ctaText: "EXPLORE STUDIO",
    },
    {
      index: "02",
      title: "CREATIVE EDUCATION",
      category: "CURRICULUM & COHORTS",
      description: "Inkubasi skill kreatif berbasis proyek langsung: fotografi komersial, tata cahaya panggung visual, dan implementasi workflow AI untuk portofolio riil.",
      metadata: "PROJECT-LED · MENTOR PRAKTISI · PORTFOLIO READY",
      href: "/programs",
      ctaText: "EXPLORE KELAS",
    },
    {
      index: "03",
      title: "CREATIVE SERVICES",
      category: "COMMERCIAL PRODUCTION",
      description: "Layanan produksi komersial terpadu untuk brand, UMKM, dan kreator: dari pemotretan katalog e-commerce hingga kampanye visual.",
      metadata: "END-TO-END ASSETS · COMMERCIAL GRADE",
      href: "/services",
      ctaText: "DETAIL LAYANAN",
    },
    {
      index: "04",
      title: "SCHOOL PARTNERSHIPS",
      category: "INSTITUTIONAL B2B",
      description: "Program kurikulum terstruktur dan workshop kreatif intensif untuk institusi pendidikan tingkat SMP, SMA, dan SMK.",
      metadata: "WORKSHOP · EKSTRAKURIKULER · KUNJUNGAN STUDIO",
      href: "/school",
      ctaText: "AJUKAN KERJASAMA",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f3f1eb] selection:bg-[#f3f1eb] selection:text-[#0a0a0a]">
      <Header />

      <main className="flex-1">
        {/* 01 / HERO — ASYMMETRIC EDITORIAL GRID */}
        <section className="border-b border-[#f3f1eb]/[0.08] py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-8">
                <SectionLabel number="01" label="NOIRE SPACE" />
                
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[0.98] tracking-tight text-[#f3f1eb]">
                  SIMPLICITY <br />
                  <span className="italic font-serif">IN THE DARK.</span>
                </h1>

                <p className="text-sm sm:text-base text-[#6f6f6a] max-w-xl font-normal leading-relaxed">
                  Ruang fisik dan ekosistem terpadu untuk pembelajaran, pembuatan konten visual komersial, dan pembentukan portofolio kreator generasi masa depan.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] bg-[#f3f1eb] text-[#0a0a0a] px-6 py-3.5 hover:bg-[#e8e6df] transition-colors font-medium"
                  >
                    <span>RESERVASI STUDIO</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#e8e6df] border border-[#f3f1eb]/[0.15] px-6 py-3.5 hover:border-[#f3f1eb]/[0.4] hover:text-[#f3f1eb] transition-colors"
                  >
                    <span>JELAJAHI PROGRAM</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#f3f1eb]/[0.08] pt-8 lg:pt-0 lg:pl-10 space-y-6">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">LOKASI & FOKUS</span>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#e8e6df]">
                    BOGOR / INDONESIA
                  </p>
                  <p className="font-mono text-[11px] text-[#6f6f6a]">
                    CREATIVE TECHNOLOGY ECOSYSTEM
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">INFRASTRUKTUR RUANG</span>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#e8e6df]">
                    3 STUDIOS · CALIBRATED LIGHTING
                  </p>
                  <p className="font-mono text-[11px] text-[#6f6f6a]">
                    GODOX · APUTURE · CYCLORAMA & FABRICS
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">STATUS OPERASIONAL</span>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#e8e6df]">
                    TERBUKA UNTUK RESERVASI & WORKSHOP
                  </p>
                  <p className="font-mono text-[11px] text-[#6f6f6a]">
                    SENIN - MINGGU · 08:00 - 22:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / MANIFESTO — EDITORIAL TYPOGRAPHY */}
        <section className="border-b border-[#f3f1eb]/[0.08] py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel number="02" label="MANIFESTO" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a] mt-4">
                  EMPAT PILAR EKOSISTEM
                </p>
              </div>

              <div className="lg:col-span-8 space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-3 border-t border-[#f3f1eb]/[0.08] pt-6">
                    <span className="font-mono text-xs text-[#6f6f6a]">01 /</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#f3f1eb]">LEARN</h2>
                    <p className="text-xs text-[#6f6f6a] leading-relaxed">
                      Belajar dari kebutuhan nyata industri komersial. Pendekatan tanpa formalitas berlebih, fokus langsung pada penguasaan teknis dan disiplin kerja.
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[#f3f1eb]/[0.08] pt-6">
                    <span className="font-mono text-xs text-[#6f6f6a]">02 /</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#f3f1eb]">CREATE</h2>
                    <p className="text-xs text-[#6f6f6a] leading-relaxed">
                      Ruang fisik terkalibrasi dengan peralatan pencahayaan profesional, set studio modular, dan asistensi teknis langsung di lokasi.
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[#f3f1eb]/[0.08] pt-6">
                    <span className="font-mono text-xs text-[#6f6f6a]">03 /</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#f3f1eb]">BUILD</h2>
                    <p className="text-xs text-[#6f6f6a] leading-relaxed">
                      Bangun portofolio visual teruji dan produk kreatif yang siap bersaing dalam pasar komersial nyata.
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[#f3f1eb]/[0.08] pt-6">
                    <span className="font-mono text-xs text-[#6f6f6a]">04 /</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#f3f1eb]">EARN</h2>
                    <p className="text-xs text-[#6f6f6a] leading-relaxed">
                      Jalur monetisasi karya dan kemampuan riil: menghubungkan talenta muda dengan permintaan klien komersial dan UMKM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / WHAT WE DO — EDITORIAL LIST */}
        <section className="border-b border-[#f3f1eb]/[0.08] py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <SectionLabel number="03" label="KAPABILITAS" />
                <h2 className="font-display text-3xl sm:text-4xl text-[#f3f1eb] font-normal">
                  WHAT WE DO
                </h2>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6a] max-w-xs sm:text-right">
                DISCOVERY & LAYANAN TERPADU NOIRE SPACE
              </p>
            </div>

            <div className="border-t border-[#f3f1eb]/[0.08]">
              {capabilities.map((c) => (
                <CatalogRow
                  key={c.index}
                  index={c.index}
                  title={c.title}
                  category={c.category}
                  description={c.description}
                  metadata={c.metadata}
                  href={c.href}
                  ctaText={c.ctaText}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 04 / SELECTED PRODUCTS — DYNAMIC CURATED CATALOG */}
        {curatedProducts.length > 0 && (
          <section className="border-b border-[#f3f1eb]/[0.08] py-24 lg:py-32">
            <div className="container mx-auto px-6 lg:px-12 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <SectionLabel number="04" label="KATALOG TERPILIH" />
                  <h2 className="font-display text-3xl sm:text-4xl text-[#f3f1eb] font-normal">
                    SELECTED EXPERIENCES
                  </h2>
                </div>
                <Link
                  href="/studio"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f6f6a] hover:text-[#f3f1eb] transition-colors"
                >
                  SEMUA LAYANAN →
                </Link>
              </div>

              <div className="border-t border-[#f3f1eb]/[0.08]">
                {curatedProducts.map((p, idx) => {
                  const href =
                    p.type === "studio"
                      ? `/studio/${p.slug}`
                      : p.type === "education"
                      ? `/programs/${p.slug}`
                      : `/services/${p.slug}`

                  const meta = [
                    p.durationMinutes ? `${p.durationMinutes} MIN` : null,
                    p.capacity ? `MAKS ${p.capacity} ORANG` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")

                  return (
                    <CatalogRow
                      key={p.id}
                      index={idx + 1}
                      title={p.name}
                      category={p.type.toUpperCase()}
                      description={p.shortDescription || p.description}
                      metadata={meta}
                      priceText={formatRupiah(p.price)}
                      href={href}
                      ctaText="RESERVASI"
                    />
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* 05 / PHYSICAL STUDIO ANCHOR */}
        <section className="border-b border-[#f3f1eb]/[0.08] py-24 lg:py-32 bg-[#0e0e0e]">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <SectionLabel number="05" label="STUDIO & ALAT" />
                
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f3f1eb] leading-tight">
                  PHYSICAL SPACE. <br />
                  CALIBRATED LIGHT.
                </h2>

                <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
                  Ruang studio kami dirancang khusus untuk memfasilitasi kebutuhan kreator visual dan produksi komersial. Disediakan peralatan tata cahaya Godox, continuous lighting Aputure, boom arms, backdrop kertas berbagai spektrum warna, dan ruang persiapan model.
                </p>

                <div className="pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#e8e6df] space-y-1.5 border-t border-[#f3f1eb]/[0.08]">
                  <p>• ROOM 01 / CYCLORAMA MAIN STAGE</p>
                  <p>• ROOM 02 / CONTENT & PORTRAIT BOOTH</p>
                  <p>• ROOM 03 / EDITING & COLOR GRADING DESK</p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3f1eb] border border-[#f3f1eb]/[0.2] px-5 py-2.5 hover:bg-[#171717] transition-all"
                  >
                    <span>LIHAT FASILITAS STUDIO</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 border border-[#f3f1eb]/[0.08] bg-[#0a0a0a] p-8 lg:p-12 space-y-8">
                <div className="flex justify-between items-baseline border-b border-[#f3f1eb]/[0.08] pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">
                    STUDIO SPECIFICATION SHEET
                  </span>
                  <span className="font-mono text-[10px] text-[#6f6f6a]">
                    BGR / 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">LIGHTING HEADS</span>
                    <p className="text-[#f3f1eb]">Godox QT600III / SK400II</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">CONTINUOUS VIDEO</span>
                    <p className="text-[#f3f1eb]">Aputure Amaran 200d / Bowens Mount</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">MODIFIERS</span>
                    <p className="text-[#f3f1eb]">Softbox 120cm, Lantern, Strip, Beauty Dish</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">BACKDROPS</span>
                    <p className="text-[#f3f1eb]">Seamless Paper (Neutral, Chroma, Mood)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">ASISTENSI</span>
                    <p className="text-[#f3f1eb]">Studio Operator On-Site Termasuk</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6f6f6a] uppercase text-[10px]">MINIMAL DURASI</span>
                    <p className="text-[#f3f1eb]">30 Menit / Sesi Fleksibel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 / FINAL CTA — MINIMAL EDITORIAL CLOSING */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 text-center space-y-6 max-w-2xl">
            <SectionLabel number="06" label="INISIATIF BERIKUTNYA" className="justify-center" />
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f3f1eb] leading-tight">
              Tools for making better work.
            </h2>

            <p className="text-xs sm:text-sm text-[#6f6f6a] leading-relaxed">
              Mulai dari reservasi studio untuk sesi fotografi hingga keikutsertaan dalam kelas inkubasi kreator muda.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/studio"
                className="font-mono text-[11px] uppercase tracking-[0.18em] bg-[#f3f1eb] text-[#0a0a0a] px-6 py-3 font-medium hover:bg-[#e8e6df] transition-colors"
              >
                PESAN SESI STUDIO
              </Link>
              <Link
                href="/register"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#e8e6df] border border-[#f3f1eb]/[0.15] px-6 py-3 hover:border-[#f3f1eb]/[0.4] transition-colors"
              >
                BUAT AKUN BARU
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
