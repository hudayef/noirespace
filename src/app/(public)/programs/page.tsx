import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { SectionLabel, CatalogRow } from "@/components/editorial"

export const metadata = {
  title: "Program Edukasi & Inkubasi Kreatif — Noire Space",
  description: "Program creative technology education Noire Space untuk generasi muda dan kreator digital.",
}

export default async function ProgramsPage() {
  const items = await getProducts({ type: "education", status: "published" })

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <SectionLabel number="02" label="CURRICULUM & COHORTS" />
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3f1eb] leading-tight">
          PROGRAM EDUKASI
        </h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed">
          Silabus berbasis proyek riil untuk membangun disiplin kerja kreator: fotografi komersial, desain visual branding, produksi konten video, dan integrasi workflow AI modern.
        </p>
      </div>

      <div className="border-t border-[#f3f1eb]/[0.08]">
        {items.length === 0 ? (
          <p className="font-mono text-xs text-[#6f6f6a] py-16 text-center uppercase tracking-wider">
            Belum ada program edukasi yang dipublikasikan.
          </p>
        ) : (
          items.map((item, idx) => {
            const meta = [
              item.durationMinutes ? `${item.durationMinutes} MENIT` : null,
              item.capacity ? `KUOTA: ${item.capacity} SISWA` : null,
            ]
              .filter(Boolean)
              .join(" · ")

            return (
              <CatalogRow
                key={item.id}
                index={idx + 1}
                title={item.name}
                category="CREATIVE COHORT"
                description={item.shortDescription || item.description}
                metadata={meta}
                priceText={item.price === 0 ? "BIAYA: GRATIS" : `Biaya registrasi: ${formatRupiah(item.price)}`}
                href={`/programs/${item.slug}`}
                ctaText="LIHAT PROGRAM"
              />
            )
          })
        )}
      </div>
    </div>
  )
}
