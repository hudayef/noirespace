import { getProducts } from "@/lib/modules/catalog/catalog.service"
import { formatRupiah } from "@/lib/utils/format"
import { SectionLabel, CatalogRow } from "@/components/editorial"

export const metadata = {
  title: "Rental Studio Foto & Konten — Noire Space",
  description: "Studio foto dan konten profesional dengan peralatan lighting modern di Noire Space Jakarta.",
}

export default async function StudioPage() {
  const items = await getProducts({ type: "studio", status: "published" })

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <SectionLabel number="01" label="PRODUCTION SPACES" />
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f3f1eb] leading-tight">
          STUDIO EXPERIENCE
        </h1>
        <p className="text-sm sm:text-base text-[#6f6f6a] leading-relaxed">
          Ruang studio terkalibrasi dengan peralatan tata cahaya industri: Godox & Aputure continuous video lights, paper backdrops berbagai tone, dan asistensi teknisi ruang.
        </p>
      </div>

      <div className="border-t border-[#f3f1eb]/[0.08]">
        {items.length === 0 ? (
          <p className="font-mono text-xs text-[#6f6f6a] py-16 text-center uppercase tracking-wider">
            Belum ada paket studio yang dipublikasikan.
          </p>
        ) : (
          items.map((item, idx) => {
            const meta = [
              item.durationMinutes ? `${item.durationMinutes} MENIT` : null,
              item.capacity ? `MAKS ${item.capacity} ORANG` : null,
            ]
              .filter(Boolean)
              .join(" · ")

            return (
              <CatalogRow
                key={item.id}
                index={idx + 1}
                title={item.name}
                category="STUDIO EXPERIENCE"
                description={item.shortDescription || item.description}
                metadata={meta}
                priceText={`Mulai dari ${formatRupiah(item.price)}`}
                href={`/studio/${item.slug}`}
                ctaText="RESERVASI"
              />
            )
          })
        )}
      </div>
    </div>
  )
}
